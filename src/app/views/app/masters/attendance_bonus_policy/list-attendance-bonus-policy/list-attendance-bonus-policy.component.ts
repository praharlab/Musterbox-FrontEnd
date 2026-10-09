import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ModalService } from 'src/app/services/modal.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NavigationStart } from '@angular/router';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-attendance-bonus-policy',
    templateUrl: './list-attendance-bonus-policy.component.html',
    styleUrls: ['./list-attendance-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAttendanceBonusPolicyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  page = {
    totalCount: 0,
    offset: 0,
  };
  length: number;
  filterform = {
    companyMasterID: [Number(localStorage.getItem('company_id'))],
    page: 1,
    limit: 10,
    searchQuery: '',
  };
  limit = 10;
  rows = [];
  rows1: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  scrollBarHorizontal = window.innerWidth < 1201;
  columns = [];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  currentPage: number;
  filterData1: any;
  ipAddress: any;
  filter1: string;
  comp: any;
  company_id: number;
  company1: any;
  alluser: any[];
  formValue: any;
  querystring: string;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/attendance_bonus_policy',
          this.adminRoot + '/masters/attendance_bonus_policy/edit_attendance_bonus_policy',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAttendanceBonusPolicyComponent', false);
        }

        // clone add
        const protectedRoutesClone = [
          this.adminRoot + '/masters/attendance_bonus_policy',
          this.adminRoot + '/masters/attendance_bonus_policy/add_attendance_bonus_policy',
        ];

        const isProtectedRouteClone = protectedRoutesClone.some((route) => event.url.includes(route));
        if (!isProtectedRouteClone) {
          formValueStorageService.removeData('attendance_bonus_policy_cloneData', true);
        }
      }
    });
  }


  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListAttendanceBonusPolicyComponent') && this.formValueStorageService.isEmptyObject('attendance_bonus_policy_cloneData')) {

      this.filterform = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterform = (this.formValue.ListAttendanceBonusPolicyComponent && this.formValue.ListAttendanceBonusPolicyComponent.body) ? this.formValue.ListAttendanceBonusPolicyComponent.body : (this.formValue.attendance_bonus_policy_cloneData && this.formValue.attendance_bonus_policy_cloneData.body) ? this.formValue.attendance_bonus_policy_cloneData.body : {
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

    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission()
    this.getIPAddress();
    this.getcompany();


    this.getConstructorData();
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
              permissionval.formName == 'AttendanceBonusPolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceBonusPolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceBonusPolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceBonusPolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };

    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onChange(e: any) {
    if (e) {
      this.filterform.page = e.offset + 1;
      this.getConstructorData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterform.searchQuery = '';
      setTimeout(() => {
        this.getConstructorData();
      }, 100);
    } else {
      this.filterform.searchQuery = inputValue;
      this.getConstructorData();
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterform.limit = ev;
      this.limit = this.filterform.limit;
      this.getConstructorData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterform.page = 1;
    this.filterform.companyMasterID = this.datefilter.value.company;
    this.getConstructorData();
  }


  getConstructorData() {
    this.spinner.start('getData');
    let string = `?page=${this.filterform.page}&limit=${this.filterform.limit}`

    if (this.filterform.searchQuery) string += `&searchQuery=${this.filterform.searchQuery}`

    if (this.filterform.companyMasterID && this.filterform.companyMasterID.length > 0) {
      this.filterform.companyMasterID.map(e => {
        string += `&companyMasterID[]=${e}`
      })
    }

    this.querystring = string
    this.api
      .callApi(this.constant.ATTENDANCEBONUSPOLICYGETALLDATA + string, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterform.page;
            this.itemsPerPage = this.filterform.limit;
          }, 100);
        }
        this.spinner.stop('getData');
      },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getData');
        },);
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  showAddNewModal() {
    this.formValueStorageService.removeData('attendance_bonus_policy_cloneData', true);
    this.router.navigate([this.adminRoot + '/masters/attendance_bonus_policy/add_attendance_bonus_policy']);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
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
          attendanceBonusPolicyId: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.ATTENDANCEBONUSPOLICYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getConstructorData();
                this.spinner.stop();
              } else {
                this.notifications.create(
                  'Error',
                  res.message,
                  NotificationType.Bare,
                  { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
                );
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Policy will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          attendanceBonusPolicyId: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.ATTENDANCEBONUSPOLICYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getConstructorData();
              } else {
                this.handleError(res.message);
              }

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
          .callApi(this.constant.ATTENDANCEBONUSPOLICYDELETEDATA + +id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.getConstructorData();

              } else {
                this.handleError(res.message);
              }
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


  downloadFile() {
    this.spinner.start('download');
    this.api
      .callApi(this.constant.ATTENDANCEBONUSPOLICYGETALLDATA + this.querystring + `&Export=true`, {}, 'GET', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }


  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Attendance Bonus Policy Name.xlsx');
    this.spinner.stop('download');
  }


  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAttendanceBonusPolicyComponent',
      this.filterform,
      '/masters/attendance_bonus_policy/edit_attendance_bonus_policy',
      rowData.attendanceBonusPolicyId,
    );
  }


  navigateToClonePage(rowData: any): void {
    this.formValueStorageService.navigate(
      'attendance_bonus_policy_cloneData',
      this.filterform,
      '/masters/attendance_bonus_policy/add_attendance_bonus_policy',
      rowData.attendanceBonusPolicyId,
    );
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListAttendanceBonusPolicyComponent', false);
    this.formValueStorageService.removeData('attendance_bonus_policy_cloneData', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
}
