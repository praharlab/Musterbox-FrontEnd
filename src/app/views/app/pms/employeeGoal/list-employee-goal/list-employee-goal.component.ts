import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-goal',
    templateUrl: './list-employee-goal.component.html',
    styleUrls: ['./list-employee-goal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeGoalComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  myInputVariable: ElementRef;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Remark', value: 'remark' };
  changeOrderBy = [
    { label: 'Remark', value: 'remark' },
    { label: 'Created By', value: 'createdBy' },
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    userMasterId: '',
    company_id: Number(localStorage.getItem('company_id')),
    branch_id: '',
    sortByField: '',
    sortByValue: 'ASC',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  usertype: any;
  company_id: any;
  file: any;
  childcompany: string;
  ipAddress: any;
  comp: any;
  selectedValue: string;
  queryStringDownload: string;
  query: string;
  currentPage: number;
  formValue: any;
  allbranch: any;
  empList: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/pms/empgoal',
          this.adminRoot + '/pms/empgoal/edit_empgoal',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeGoalComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListEmployeeGoalComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        userMasterId: '',
        branch_id: '',
        company_id: Number(localStorage.getItem('company_id')),
        sortByField: '',
        sortByValue: 'ASC',
      };
    } else {
      this.body = this.formValue.ListEmployeeGoalComponent.body;
      this.body.sortByField = '';
      this.body.sortByValue = 'ASC';
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getEmployeeGoalData();
    this.getcompany();
  }
  getEmployeeGoalData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}`;
    if (this.body.company_id) {
      queryString += `&companyMasterID=${this.body.company_id}`;
    }
    if (this.body.userMasterId) {
      queryString += `&userMasterID=${this.body.userMasterId}`;
    }
    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }
    this.query = queryString;
    this.api
      .callApi(this.constant.GETALLEMPLOYEEGOAL + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
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
              permissionval.formName == 'AssignGoalToEmployee' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignGoalToEmployee' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignGoalToEmployee' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignGoalToEmployee' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }
  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getEmployeeGoalData();
  }

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }

    this.body.company_id = this.companyfilter.value.companyMasterID;
    this.getEmployeeGoalData();
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }
  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getEmployeeGoalData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getEmployeeGoalData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/pms/empgoal/add_empgoal']);
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
          KRAID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEGOAL + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              this.getEmployeeGoalData();
              this.notifications.create('Done', res.message, NotificationType.Success, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  clear() {
    this.companyfilter.resetForm();
    this.formValueStorageService.removeData('ListEmployeeGoalComponent', false);
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
          setTimeout(() => {
            this.selectcompany(this.company_id);
          }, 100);
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }


  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEGOAL +
          this.query +
          `&exportFileType=${this.selectedValue}&exportData=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'EmployeeGoal.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'EmployeeGoal.xlsx');
            this.selectedValue = null;
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.selectedValue = null;
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
        },
      );
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
      'ListEmployeeGoalComponent',
      this.body,
      '/pms/empgoal/edit_empgoal',
      rowData.id,
    );
  }

  selectcompany(id) {
    if (!id) {
      this.clear();
      return;
    }
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        },
        () => {
          this.handleError('something went wrong!');
          this.spinner.stop('branch');
        },
      );

    const body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('company1');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.empList = res.data;

            this.spinner.stop('company1');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stop('company1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company1');
        },
      );
  }

  selectbranch(id) {
    if (!id) {
      this.empList = [];
      this.body.userMasterId = '';
      this.selectcompany(this.body.company_id)
      return;
    }
    const filterData = {
      branchMasterID: id,
    };
    if (id != '' && id != null) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.empList = res.data;
              this.spinner.stop();
            } else {
              this.handleError('Something Went Wrong!');
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop();
          },
        );
    } else {
      const body = {
        page: '',
        limit: '',
        companyMasterID: this.companyfilter.value.company,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.empList = res.data;

              this.spinner.stop();
            } else {
              this.handleError('Something Went Wrong!');
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop();
          },
        );
    }
  }

}
