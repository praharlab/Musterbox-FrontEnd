import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-my-outdoor-duty',
    templateUrl: './list-my-outdoor-duty.component.html',
    styleUrls: ['./list-my-outdoor-duty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListMyOutdoorDutyComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  LeaveAuthData = [];
  adminRoot = environment.adminRoot;

  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    userMasterID: localStorage.getItem('id'),
  };
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  currentPage: number;
  formValue: any;
  apiURL = environment.apiUrl;
  authdata: any;
  auth_Criteria: any;
  rowData: any;

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
          this.adminRoot + '/attendances/my_Outdoor_Duty',
          this.adminRoot + '/attendances/my_Outdoor_Duty/edit_my_Outdoor_Duty',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListmyOutdoorDutyComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListmyOutdoorDutyComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        userMasterID: localStorage.getItem('id')
      };
    } else {
      this.filterData = this.formValue.ListmyOutdoorDutyComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getData();
    this.checkpermission();
  }

  getData() {
    this.spinner.start('oninit');
    this.api
      .callApi(this.constant.LISTMYOUTDOORDUTY, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
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

  // ---------------------

  showdata(row) {
    this.rowData = row;

    this.auth_Criteria = row.userMaster.authorizationDetails && row.userMaster.authorizationDetails.length > 0 ? row.userMaster.authorizationDetails[0].AuthorizationCriteriaMaster.AuthorizationCriteria : null;


    this.spinner.start('data');

    this.api
      .callApi(
        this.constant.GETLEAVEDETAILBYID + row.UserLeaveApplicationID,
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

    this.spinner.start('show')
    this.api
      .callApi(
        this.constant.LEAVEAUTHREQUESTDATABYREFERANCE + row.UserLeaveApplicationID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.authdata = res.data;
        }
        this.spinner.stop('show');
      });
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
              permissionval.formName == 'MyOutdoorDuty' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyOutdoorDuty' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyOutdoorDuty' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyOutdoorDuty' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }


  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getData();
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
    this.router.navigate([this.adminRoot + '/attendances/my_Outdoor_Duty/add_my_Outdoor_Duty']);
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
          .callApi(this.constant.DELETELEAVE + '/' + id, {}, 'GET', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', 'Outdoor Duty Deleted Successfully.', NotificationType.Bare, {
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListmyOutdoorDutyComponent',
      this.filterData,
      '/attendances/my_Outdoor_Duty/edit_my_Outdoor_Duty',
      rowData.UserLeaveApplicationID,
    );
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListmyOutdoorDutyComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

}
