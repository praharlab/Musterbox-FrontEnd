import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-mail-fields',
    templateUrl: './list-mail-fields.component.html',
    styleUrls: ['./list-mail-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListMailFieldsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'mailFieldsID' },
    { name: 'Mail Fields Name', prop: 'mailFieldsname' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  filterData = {
    page: 1,
    limit: 10,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate = [1];
  limit = 10;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {}

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getData();
  }

  getData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLMAILFIELDSDATA, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  // updateFilter(event): void {
  //   const inputValue = event.target.value.trim().toLowerCase();
  //   if (inputValue.length == 0) {
  //     this.formValueStorageService.removeData('ListMailFieldsComponent', false);
  //     this.filterData.searchQuery = '';
  //     setTimeout(() => {
  //       this.ngOnInit();
  //     }, 100);
  //   } else {
  //     this.filterData.searchQuery = inputValue;
  //     this.getData();
  //   }
  // }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/mail_fields/add_mail_fields']);
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          mailfieldsid: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEMAILFIELDDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getData();
              this.spinner.stop('confirm');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          mailfieldsid: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.MAILFIELDSSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.spinner.stop('deactive');
              this.getData();
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          mailfieldsid: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.MAILFIELDSSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getData();
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
}
