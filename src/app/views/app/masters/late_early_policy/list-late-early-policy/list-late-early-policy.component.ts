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
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-late-early-policy',
    templateUrl: './list-late-early-policy.component.html',
    styleUrls: ['./list-late-early-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListLateEarlyPolicyComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;

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
    status: [0, 1],
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
  events: any;
  comp: any;

  limit = 10;
  currentPage: number;
  formValue: any;

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
          this.adminRoot + '/masters/lateComeEarlyGo',
          this.adminRoot + '/masters/lateComeEarlyGo/edit_lateComeEarlyGo',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListLateEarlyPolicyComponent', false);
        }

          // clone add
          const protectedRoutesClone = [
            this.adminRoot + '/masters/lateComeEarlyGo',
            this.adminRoot + '/masters/lateComeEarlyGo/add_lateComeEarlyGo',
          ];
  
          const isProtectedRouteClone = protectedRoutesClone.some((route) =>
            event.url.includes(route),
          );
          if (!isProtectedRouteClone) {
            formValueStorageService.removeData('lateComeEarlyGo_cloneData', true);
          }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListLateEarlyPolicyComponent') && this.formValueStorageService.isEmptyObject('lateComeEarlyGo_cloneData')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        status: [0, 1],
        searchQuery: '',
      };
    } else {
      // this.filterData = this.formValue.ListLateEarlyPolicyComponent.body;
      this.filterData =
        this.formValue.ListLateEarlyPolicyComponent && this.formValue.ListLateEarlyPolicyComponent.body
          ? this.formValue.ListLateEarlyPolicyComponent.body
          : this.formValue.lateComeEarlyGo_cloneData && this.formValue.lateComeEarlyGo_cloneData.body
          ? this.formValue.lateComeEarlyGo_cloneData.body
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

    this.getlateearlyPolicy();
    this.checkpermission();
    this.getcompany();
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

  getlateearlyPolicy() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETALLEARLYPOLICY, this.filterData, 'POST', true, false, true)
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
            this.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
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
              permissionval.formName == 'LateInEarlygoPolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LateInEarlygoPolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LateInEarlygoPolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LateInEarlygoPolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getlateearlyPolicy();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getlateearlyPolicy();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getlateearlyPolicy();
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

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getlateearlyPolicy();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getlateearlyPolicy();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.formValueStorageService.removeData('lateComeEarlyGo_cloneData', true);
    this.router.navigate([this.adminRoot + '/masters/lateComeEarlyGo/add_lateComeEarlyGo']);
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
          .callApi(this.constant.DELETELATEEARLYPOLICY + id , {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getlateearlyPolicy();
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
          lateEarlyPolicyMasterID: id,
          status: 0,
        };
        this.spinner.start('deactive');

        this.api
          .callApi(this.constant.STATUSCHANGEEARLYPOLICY, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getlateearlyPolicy();
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
          lateEarlyPolicyMasterID: id,
          status: 1,
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.STATUSCHANGEEARLYPOLICY, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getlateearlyPolicy();
                this.spinner.stop('active');
              } else {
                this.handleError(res.message);
                this.spinner.stop('active');
              }
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

    this.formValueStorageService.removeData('ListLateEarlyPolicyComponent', false);
    this.formValueStorageService.removeData('lateComeEarlyGo_cloneData', false);
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
      'ListLateEarlyPolicyComponent',
      this.filterData,
      '/masters/lateComeEarlyGo/edit_lateComeEarlyGo',
      rowData.lateEarlyPolicyMasterID,
    );
  }
  navigateToClonePage(lateEarlyPolicyMasterID: any): void {
    this.formValueStorageService.navigate(
      'lateComeEarlyGo_cloneData',
      this.filterData,
      '/masters/lateComeEarlyGo/add_lateComeEarlyGo',
      lateEarlyPolicyMasterID,
    );
  }
}
