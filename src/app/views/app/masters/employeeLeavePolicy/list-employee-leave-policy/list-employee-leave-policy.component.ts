import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-leave-policy',
    templateUrl: './list-employee-leave-policy.component.html',
    styleUrls: ['./list-employee-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeLeavePolicyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'employeeLeavePolicyID', prop: 'employeeLeavePolicyID' },
    { name: 'LeavePolicyName', prop: 'LeavePolicyName' },
    { name: 'Company', prop: 'companyMasterID' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    search: '',
    exportData: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  adminRoot = environment.adminRoot;
  rows1: any = [];
  queryString: string;
  comp: any;
  companyId: number;
  currentPage: number;
  formValue: any;
  itemsPerPage = 10;

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
          this.adminRoot + '/masters/employee_leave_policy',
          this.adminRoot + '/masters/employee_leave_policy/edit_employee_leave_policy',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeLeavePolicyComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListEmployeeLeavePolicyComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        search: '',
        exportData: '',
      };
    } else {
      this.filterData = this.formValue.ListEmployeeLeavePolicyComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
    this.getcompany();
    this.getData();
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

  getData() {
    let string = `?page=${this.filterData.page}&limit=${this.filterData.limit}`;

    this.filterData.companyMasterID.map((e) => {
      string += `&companyMasterID[]=${e}`;
    });

    if (this.filterData.search) string += `&search=${this.filterData.search}`;

    this.queryString = string;

    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETEMPLOYEELEAVEPOLICYDATA + string, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('data');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
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
              permissionval.formName == 'EmployeeLeavePolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeLeavePolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeLeavePolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeLeavePolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.search = '';
      setTimeout(() => {
        this.getData();
      }, 100);
    } else {
      this.filterData.search = inputValue;
      this.getData();
    }
  }

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
    this.router.navigate([this.adminRoot + '/masters/employee_leave_policy/add_employee_leave_policy']);
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListEmployeeLeavePolicyComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  downloadFile() {
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETEMPLOYEELEAVEPOLICYDATA + this.queryString + `&exportData=true`,
        {},
        'GET',
        true,
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.handleError('No data found to export!');
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Employee Leave Policy.xlsx`);
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('a');
        },
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
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEEMPLOYEELEAVEPOLICY + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getData();
                this.spinner.stop('delete');
              } else {
                this.getData();
                this.handleError(res.message);
                this.spinner.stop('delete');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('delete');
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
      'ListEmployeeLeavePolicyComponent',
      this.filterData,
      '/masters/employee_leave_policy/edit_employee_leave_policy',
      rowData.id,
    );
  }
}
