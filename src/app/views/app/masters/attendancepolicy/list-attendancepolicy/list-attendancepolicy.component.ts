import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from '../../../../../constants/labelUtils';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-attendancepolicy',
    templateUrl: './list-attendancepolicy.component.html',
    styleUrls: ['./list-attendancepolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAttendancepolicyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'attendancePolicyID', prop: 'attendancePolicyID' },
    { name: 'attendancePolicyName', prop: 'attendancePolicyName' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  rows1: any = [];
  adminRoot = environment.adminRoot;
  comp: any;
  events: any;
  currentPage: number;
  formValue: any;
  limit = 10;
  defaultPolicy = labelUtils.defaultPolicy;

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
          this.adminRoot + '/masters/attendance_policy',
          this.adminRoot + '/masters/attendance_policy/edit_attendance_policy',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAttendancepolicyComponent', false);
        }

        // clone add
        const protectedRoutesClone = [
          this.adminRoot + '/masters/attendance_policy',
          this.adminRoot + '/masters/attendance_policy/add_attendance_policy',
        ];

        const isProtectedRouteClone = protectedRoutesClone.some((route) =>
          event.url.includes(route),
        );
        if (!isProtectedRouteClone) {
          formValueStorageService.removeData('attendance_policy_cloneData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (
      this.formValueStorageService.isEmptyObject('ListAttendancepolicyComponent') &&
      this.formValueStorageService.isEmptyObject('attendance_policy_cloneData')
    ) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterData =
        this.formValue.ListAttendancepolicyComponent &&
        this.formValue.ListAttendancepolicyComponent.body
          ? this.formValue.ListAttendancepolicyComponent.body
          : this.formValue.attendance_policy_cloneData &&
            this.formValue.attendance_policy_cloneData.body
          ? this.formValue.attendance_policy_cloneData.body
          : {
              page: 1,
              limit: 10,
              companyMasterID: [+localStorage.getItem('company_id')],
              searchQuery: '',
            };
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
    this.getAttendancePolicy();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
        }
        this.spinner.stop('company');
      });
  }
  getAttendancePolicy() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETATTENDENCEDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('main');
          } else {
            this.spinner.stop('main');
            this.handleError(res.message);
          }
        },
        (err) => {
          this.spinner.stop('main');
          this.handleError(err.error.message);
        },
      );
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'AttendancePolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendancePolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendancePolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendancePolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAttendancePolicy();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAttendancePolicy();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getAttendancePolicy();
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAttendancePolicy();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAttendancePolicy();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }
  showAddNewModal() {
    this.formValueStorageService.removeData('attendance_policy_cloneData', true);

    this.router.navigate([this.adminRoot + '/masters/attendance_policy/add_attendance_policy']);
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
          attendancePolicyID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEATTENDENCE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getAttendancePolicy();
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
          attendancePolicyID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.ATTENDENCESTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getAttendancePolicy();
                this.spinner.stop('deactive');
              } else {
                this.handleError(res.message);
                this.spinner.stop('deactive');
              }
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
          attendancePolicyID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.ATTENDENCESTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getAttendancePolicy();
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

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListAttendancepolicyComponent', false);
    this.formValueStorageService.removeData('attendance_policy_cloneData', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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
      'ListAttendancepolicyComponent',
      this.filterData,
      '/masters/attendance_policy/edit_attendance_policy',
      rowData.attendancePolicyID,
    );
  }

  navigateToClonePage(attendancePolicyID: any): void {
    this.formValueStorageService.navigate(
      'attendance_policy_cloneData',
      this.filterData,
      '/masters/attendance_policy/add_attendance_policy',
      attendancePolicyID,
    );
  }
}
