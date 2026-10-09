import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-food-allowance-policy',
    templateUrl: './list-food-allowance-policy.component.html',
    styleUrls: ['./list-food-allowance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListFoodAllowancePolicyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  SelectionType = SelectionType;

  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    search: '',
    Export: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  events: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  file: any;
  childcompany: string;
  ipAddress: any;
  comp: any;
  adminRoot = environment.adminRoot;
  company: any;

  currentPage: number;
  formValue: any;
  queryString: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/foodAllowancePolicy',
          this.adminRoot + '/masters/foodAllowancePolicy/edit_foodAllowancePolicy',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListFoodAllowancePolicyComponent', false);
        }

        // clone add
        const protectedRoutesClone = [
          this.adminRoot + '/masters/foodAllowancePolicy/add_foodAllowancePolicy',
          this.adminRoot + '/masters/foodAllowancePolicy',
        ];

        const isProtectedRouteClone = protectedRoutesClone.some((route) =>
          event.url.includes(route),
        );
        if (!isProtectedRouteClone) {
          formValueStorageService.removeData('foodAllowancePolicy_cloneData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = [+localStorage.getItem('company_id')];
    this.formValue = this.formValueStorageService.getData();

    if (
      this.formValueStorageService.isEmptyObject('ListFoodAllowancePolicyComponent') &&
      this.formValueStorageService.isEmptyObject('foodAllowancePolicy_cloneData')
    ) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        search: '',
        Export: '',
      };
    } else {
      this.filterData =
        this.formValue.ListFoodAllowancePolicyComponent &&
          this.formValue.ListFoodAllowancePolicyComponent.body
          ? this.formValue.ListFoodAllowancePolicyComponent.body
          : this.formValue.foodAllowancePolicy_cloneData && this.formValue.foodAllowancePolicy_cloneData.body
            ? this.formValue.foodAllowancePolicy_cloneData.body
            : {
              page: 1,
              limit: 10,
              companyMasterID: [+localStorage.getItem('company_id')],
              search: '',
              Export: '',
            };
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getFoodAllowancePolicyData();
    this.checkpermission();
    this.getcompany();
  }

  getFoodAllowancePolicyData() {
    this.spinner.start('main');

    let string = `?page=${this.filterData.page}&limit=${this.filterData.limit}`;

    if (this.filterData.companyMasterID && this.filterData.companyMasterID.length > 0) {
      this.filterData.companyMasterID.map((e) => {
        string += `&companyMasterID[]=${e}`;
      });
    }

    if (this.filterData.search) string += `&searchQuery=${this.filterData.search}`;

    this.queryString = string;

    this.api
      .callApi(this.constant.LISTFOODALLOWANCEPOLICY + string, {}, 'GET', true, false, true)
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
              permissionval.formName == 'FoodAllowancePolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'FoodAllowancePolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'FoodAllowancePolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'FoodAllowancePolicy' &&
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
      this.filterData.search = '';
      setTimeout(() => {
        this.getFoodAllowancePolicyData();
      }, 100);
    } else {
      this.filterData.search = inputValue;
      this.getFoodAllowancePolicyData();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getFoodAllowancePolicyData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getFoodAllowancePolicyData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getFoodAllowancePolicyData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.formValueStorageService.removeData('foodAllowancePolicy_cloneData', true);
    this.router.navigate([this.adminRoot + '/masters/foodAllowancePolicy/add_foodAllowancePolicy']);
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
          .callApi(this.constant.DELETEFOODALLOWANCEPOLICY + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.getFoodAllowancePolicyData();
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

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListFoodAllowancePolicyComponent', false);
    this.formValueStorageService.removeData('foodAllowancePolicy_cloneData', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Food Allowance Policy will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.UPDATEFOODALLOWANCEPOLICYSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });

                this.getFoodAllowancePolicyData();
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
      text: 'Food Allowance Policy will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id: id,
          status: '1',
        };
        this.spinner.start('active');

        this.api
          .callApi(this.constant.UPDATEFOODALLOWANCEPOLICYSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getFoodAllowancePolicyData();
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

  downloadFile() {
    this.spinner.stop('start');

    this.api
      .callApi(
        this.constant.LISTFOODALLOWANCEPOLICY + this.queryString + `&Export=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          if (err.name === 'TimeoutError') {
            this.handleError('TimeoutError');
            this.spinner.stop('start');
          } else {
            this.handleError(err.error.message);
            this.spinner.stop('start');
          }
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'FoodAllowancePolicy.xlsx');
    this.spinner.stop('start');
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
      'ListFoodAllowancePolicyComponent',
      this.filterData,
      '/masters/foodAllowancePolicy/edit_foodAllowancePolicy',
      rowData.id,
    );
  }

  navigateToAddPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'foodAllowancePolicy_cloneData',
      this.filterData,
      '/masters/foodAllowancePolicy/add_foodAllowancePolicy',
      rowData.id,
    );
  }
}
