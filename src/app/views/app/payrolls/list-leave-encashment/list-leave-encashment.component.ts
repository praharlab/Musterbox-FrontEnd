import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-list-leave-encashment',
    templateUrl: './list-leave-encashment.component.html',
    styleUrls: ['./list-leave-encashment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListLeaveEncashmentComponent implements OnInit {
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: [],
    toMonth: '',
    fromMonth: '',
    exportData: false,
    companyMasterID: '',
    encashmentStatus: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  }; permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  rows: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.checkpermission();

  }
  onLimitChange(ev: any) {
    this.filterData.limit = ev;

    this.getAllData();
  }

  clearData() {
    this.rows = []
  }
  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'leaveEncashment' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'leaveEncashment' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'leaveEncashment' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'leaveEncashment' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  export() {
    this.filterData.exportData = true

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETALLLEAVEENCASHMENT, this.filterData, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Leave Encashment.xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('getAll');
    this.filterData.exportData = false
    this.api
      .callApi(this.constant.GETALLLEAVEENCASHMENT, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0)
            this.showButtons.push(CommonFilterButtonFields.Excel);
          this.page.totalCount = res.totalCount;
        }
        this.spinner.stop('getAll');
      });
  }


  getCompany(val: any) {
    this.filterData.companyMasterID = val
    this.getAllData();
  }
  onSubmit(val: any) {
    this.filterData.fromMonth = val.fromMonth;
    this.filterData.toMonth = val.toMonth;
    this.filterData.userMasterID = val.user ? val.user : [];
    this.filterData.exportData = false
    this.filterData.encashmentStatus = val.encashmentStatus
    this.getAllData();
  }

  alertLapseConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Leave Encashment will Lapsed!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Lapsed it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id: id,
          operationType: 'cancelLeaveEncashmentAndLapse',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.CANCELLEAVEENCASHMENT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getAllData();

            this.spinner.stop('deactive');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('deactive');
          },
        );
      }
    });
  }
  alertCancelConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Leave Encashment will Cancelled!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancelled it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id: id,
          operationType: 'cancelLeaveEncashment',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.CANCELLEAVEENCASHMENT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getAllData();
            this.spinner.stop('active');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onPageChange(data) {
    this.filterData.page = data.page;
    this.filterData.limit = data.itemsPerPage;
    this.getAllData();
  }
}
