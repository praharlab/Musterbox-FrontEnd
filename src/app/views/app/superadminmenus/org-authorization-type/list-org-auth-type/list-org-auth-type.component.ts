import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-list-org-auth-type',
    templateUrl: './list-org-auth-type.component.html',
    styleUrls: ['./list-org-auth-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListOrgAuthTypeComponent implements OnInit {
@ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp = [];
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate = [1];

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/orgAuthorizationType',
          '/app/superadminmenus/orgAuthorizationType/edit',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListOrgAuthTypeComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListOrgAuthTypeComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListOrgAuthTypeComponent.body;
    }

    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getOrgAuthorizationTypeData();
  }

  getOrgAuthorizationTypeData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETORGAUTHORIZATIONTYPE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('data');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListOrgAuthTypeComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getOrgAuthorizationTypeData();
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getOrgAuthorizationTypeData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getOrgAuthorizationTypeData();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/orgAuthorizationType/add']);
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
        this.api.callApi(this.constant.DELETEORGAUTHORIZATIONTYPEBYID + id, {}, 'DELETE', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.commonNotificationService.handleSuccess(res.message);
              this.getOrgAuthorizationTypeData();
              this.spinner.stop('confirm');
            } else {
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('confirm');
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('confirm');
          },
        );
      }
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Org Authorization Type will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          orgAuthorizationTypeID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.CHANGEORGAUTHORIZATIONTYPESTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getOrgAuthorizationTypeData();
              this.spinner.stop('deactive');
              this.commonNotificationService.handleSuccess(res.message);
            } else {
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('deactive');
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('deactive');
          },
        );
      }
    });
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Org Authorization Type will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          orgAuthorizationTypeID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.CHANGEORGAUTHORIZATIONTYPESTATUS, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if(res.status == 200){
              this.commonNotificationService.handleSuccess(res.message);
              this.getOrgAuthorizationTypeData();
              this.spinner.stop('active');
            }else{
              this.commonNotificationService.handleError(res.message);
            }
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListOrgAuthTypeComponent',
      this.filterData,
      '/superadminmenus/orgAuthorizationType/edit',
      rowData.orgAuthorizationTypeID,
    );
  }
}
