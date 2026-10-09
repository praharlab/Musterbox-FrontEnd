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
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-hr-salary-fields',
    templateUrl: './list-hr-salary-fields.component.html',
    styleUrls: ['./list-hr-salary-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListHrSalaryFieldsComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  nonEditableIds: any = [1, 50, 9, 16, 17, 24, 34, 43, 78, 83, 96, 97, 4, 5, 12, 13, 14, 25, 66, 99, 92, 67, 101,15];

  selected = ['SalaryFieldID', 'Salary Field Name', 'CompanyName', 'Status'];
  tabledata = [
    'SalaryFieldID',
    'Salay Field Name',
    'CompanyName',
    'FieldActive',
    'AttendanceCheck',
    'Default Percentage',
    'Fix Or Variable',
    'CTC Effect',
    'Field Index',
    'Max Amount',
    'Max Range',
    'Field Round',
    'Field RoundNo',
    'FieldShow',
    'ShowInCTC',
    'FieldSide',
    'FieldSrNo',
    'CountON',
    'Status',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
  ];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
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
  adminRoot = environment.adminRoot;
  comp: any;

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
          this.adminRoot + '/masters/hr_field_salary',
          this.adminRoot + '/masters/hr_field_salary/edit_hr_field_salary',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListHrSalaryFieldsComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListHrSalaryFieldsComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListHrSalaryFieldsComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getHrSalaryField();
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

  getHrSalaryField() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETHRFIELD, this.filterData, 'POST', true, false, true)
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
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
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
              permissionval.formName == 'SalaryFields' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalaryFields' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalaryFields' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalaryFields' &&
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
        this.getHrSalaryField();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getHrSalaryField();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getHrSalaryField();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getHrSalaryField();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getHrSalaryField();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/hr_field_salary/add_hr_field_salary']);
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
          salaryFieldID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEHRFIELD, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getHrSalaryField();
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
          salaryFieldID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.HRFIELDSSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getHrSalaryField();
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
          salaryFieldID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.HRFIELDSSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getHrSalaryField();
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

    this.formValueStorageService.removeData('ListHrSalaryFieldsComponent', false);
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
      'ListHrSalaryFieldsComponent',
      this.filterData,
      '/masters/hr_field_salary/edit_hr_field_salary',
      rowData.salaryFieldID,
    );
  }

  downloadFile() {
    this.spinner.start('main');

    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };

    this.api
      .callApi(this.constant.GETHRFIELD, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Hr Salary Fields.xlsx');
    this.spinner.stop('main');
  }
}


