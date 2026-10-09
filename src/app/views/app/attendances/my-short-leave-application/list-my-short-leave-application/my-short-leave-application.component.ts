import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-my-short-leave-application',
    templateUrl: './my-short-leave-application.component.html',
    styleUrls: ['./my-short-leave-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyShortLeaveApplicationComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    userMasterID: localStorage.getItem('id'),
  };
  limit = 10;

  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number;
  itemsPerPage = 10;
  

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  adminRoot = environment.adminRoot;

  rowData: any;
  auth_Criteria: any;
  LeaveAuthData = [];
  authdata: any;

  constructor(
      private spinner: NgxUiLoaderService,
      private api: ApiService,
      private constant: ConstantService,
      private router: Router,
      private notifications: AppNotificationService,
      private formValueStorageService: FormValueStorageService,
    ) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            // this.adminRoot + '/attendances/my-short-leave-application',
            // this.adminRoot + '/attendances/edit-short-leave-application',
          ];
  
          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeData('MyShortLeaveApplication', false);
          }
        }
      });
    }

  ngOnInit(): void {
    this.checkpermission()
    this.getData()
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
              permissionval.formName == 'MyShortLeaveApplication' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyShortLeaveApplication' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyShortLeaveApplication' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyShortLeaveApplication' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
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

  private handleError(message: any) {
      this.notifications.create('Error', message, NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
  }

  getData() {
    this.spinner.start('oninit');
    this.api
      .callApi(this.constant.GETSHORTLEAVEAPPLICATIONDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.auth_Criteria = res.authCritereaData
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('oninit');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit');
        },
      );
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/attendances/my-short-leave-application/add-short-leave-application']);
  }

  onSubmit() {
    if (!this.datefilter.valid) return;
    this.filterData.startDate = this.datefilter.value.startdate;
    this.filterData.endDate = this.datefilter.value.enddate;
    this.getData();
  }

  clear() {
    this.datefilter.resetForm();
    this.filterData.startDate = ''
    this.filterData.endDate = ''
    this.getData()
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showdata(row) {
    this.rowData = row;
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETSHORTLEAVEAUTHORIZATIONBYID + row.userShortLeaveId,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.LeaveAuthData = res.data;
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'myShortLeaveApplication',
      this.filterData,
      '/attendances/my-short-leave-application/edit-short-leave-application',
      rowData.userShortLeaveId,
    );
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
          this.spinner.start('confirm');
          this.api
            .callApi(this.constant.DELETESHORTLEAVEAPPLICATION + '/' + id, {}, 'DELETE', true, true, true)
            .subscribe(
              (res: any) => {
                if (res.status == 200) {
                  this.notifications.create('Done', 'Short Leave Application Deleted Successfully.', NotificationType.Bare, {
                    theClass: 'outline primary',
                    timeOut: 3000,
                    showProgressBar: true,
                  });
                  this.getData();
                  this.spinner.stop('confirm');
                } else {
                  this.handleError(res.message);
                  this.spinner.stop('confirm');
                }
              },
              (err) => {
                this.handleError(err.error.message);
                this.spinner.stop('confirm');
              },
            );
        }
      });
    }

}
