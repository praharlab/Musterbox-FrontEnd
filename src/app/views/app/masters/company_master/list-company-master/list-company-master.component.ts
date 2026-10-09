import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-company-master',
    templateUrl: './list-company-master.component.html',
    styleUrls: ['./list-company-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListCompanyMasterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['CompanyLogo', 'CompanyName', 'City', 'CompanyEmail', 'CreateBy'];
  SelectionType = SelectionType;
  tabledata = [
    'CompanyLogo',
    'CompanyName',
    'CompanyEmail',
    'CompanyAddress',
    'cpName',
    'cpMobileNo',
    'cpEmail',
    'City',
    'CompanyWebsite',
    'CompanyType',
    'ParentCompany',
    'employeeCodePattern',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
    'PanNumber',
    'TanNumber',
  ];

  selectAllState = '';
  body = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  searchValue: any;
  currentPage: number = 1;

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
          '/app/masters/company_master/view_company_master',
          '/app/masters/company_master/edit_company_master',
          '/app/superadminmenus/company_subscription',
          '/app/superadminmenus/company_subscription/add_company_subscription',
          '/app/superadminmenus/company_subscription/edit_company_subscription',
          '/app/masters/company_contact',
          '/app/masters/add_company_contact',
          '/app/masters/edit_company_contact',
          '/app/masters/company_master',
          '/app/superadminmenus/company_master',
          '/app/masters/employee',
          '/app/superadminmenus/company_training',
          '/app/superadminmenus/company_progress'
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));

        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListCompanyMasterComponent', false);
          formValueStorageService.removeData('ListCompanyContactComponent', false);
          formValueStorageService.removeData('ListSubscriptionPlanComponent', false);
          formValueStorageService.removeData('ListCompanyTrainingComponent', false);
          formValueStorageService.removeData('ListCompanyProgressComponent', false);

        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListCompanyMasterComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        searchQuery: '',
        companyMasterID: localStorage.getItem('company_id'),
      };
    } else {
      this.body = this.formValue.ListCompanyMasterComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    if (this.usertype == 2) {
      this.selected.push('Status');
      this.tabledata.push('Status');
    }

    this.getcompanydata();
    this.checkpermission();
  }

  getcompanydata() {
    let apiEndpoint;
    switch (this.usertype) {
      case '2':
        apiEndpoint = this.constant.GETCOMPANYDATA;
        // apiEndpoint = this.constant.GETCOMPANYDATAV2;
        break;
      case '3':
        // apiEndpoint = this.constant.getCompanyByParentCompany2;
        apiEndpoint = this.constant.GETCOMPANYDATA;
        break;
      case '4':
        apiEndpoint = this.constant.getCompanyByParentCompany3;
        break;
      default:
        this.body.companyMasterID = localStorage.getItem('company_id');
        apiEndpoint = this.constant.getCompanyByParentCompany;
    }

    this.spinner.start('main');
    this.api.callApi(apiEndpoint, this.body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
        } else {
          this.handleError('something went wrong!');
        }
        this.spinner.stop('main');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('main');
      },
    );
  }

  checkpermission() {
    if (this.usertype != 2 && this.usertype != 3 && this.usertype != 4) {
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
                permissionval.formName == 'Company' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' && permissionval.operationName.includes('Edit')
              );
            });
            this.permissionview = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' && permissionval.operationName.includes('View')
              );
            });
            this.permissioncreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' &&
                permissionval.operationName.includes('Create')
              );
            });
            this.spinner.stop();
          }
        });
    } else {
      this.permissioncreate = [1];
      this.permissionedit = [1];
      this.permissionview = [1];
      this.permissiondelete = [1];
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getcompanydata();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.body.companyMasterID = localStorage.getItem('company_id');
      this.getcompanydata();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.body.startdate = this.datefilter.value.startdate;
    this.body.enddate = this.datefilter.value.enddate;
    this.getcompanydata();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getcompanydata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getcompanydata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/company_master/add_company_master']);
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
          companyMasterID: id,
        };
        this.spinner.start('alert');
        this.api.callApi(this.constant.DELETEOMPANYDATA, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.ngOnInit();
              this.spinner.stop('alert');
            } else {
              this.handleError(res.message);
              this.spinner.stop('alert');
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('alert');
          },
        );
      }
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Company will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          companyMasterID: id,
          status: '0',
        };
        this.spinner.start('alertDeactive');
        this.api
          .callApi(this.constant.COMPANYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.ngOnInit();
                this.spinner.stop('alertDeactive');
              } else {
                this.handleError(res.message);
                this.spinner.stop('alertDeactive');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('alertDeactive');
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
          companyMasterID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.COMPANYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.ngOnInit();
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

    this.formValueStorageService.removeData('ListCompanyMasterComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
  }

  downloadFile() {
    this.spinner.stop('start');

    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
      exportData: true,
    };

    if (this.body.searchQuery) {
      mainbody.searchQuery = this.body.searchQuery;
    }
    if (this.body.startdate && this.body.enddate) {
      mainbody.startdate = this.datefilter.value.startdate;
      mainbody.enddate = this.datefilter.value.enddate;
    }

    let apiEndpoint: string;
    switch (this.usertype) {
      case '2':
        // apiEndpoint = this.constant.GETCOMPANYDATA;
        apiEndpoint = this.constant.GETCOMPANYDATAV2;
        break;
      case '3':
        // apiEndpoint = this.constant.getCompanyByParentCompany2;
        apiEndpoint = this.constant.GETCOMPANYDATAV2;
        break;
      case '4':
        apiEndpoint = this.constant.getCompanyByParentCompany3;
        break;
        break;
      default:
        apiEndpoint = this.constant.getCompanyByParentCompany;
        break;
    }

    this.api.callApi(apiEndpoint, mainbody, 'POST', true, false, true, true).subscribe(
      (res: any) => this.handleFileDownload(res),
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('main');
      },
    );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Company.xlsx');
    this.spinner.stop('main');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToViewPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyMasterComponent',
      this.body,
      '/masters/company_master/view_company_master',
      rowData.companyMasterID,
    );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyMasterComponent',
      this.body,
      '/masters/company_master/edit_company_master',
      rowData.companyMasterID,
    );
  }

  navigateToContactPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyMasterComponent',
      this.body,
      '/masters/company_contact',
      rowData.companyMasterID,
    );
  }


  navigateToCompanyProgress(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyMasterComponent',
      this.body,
      '/superadminmenus/company_progress',
      rowData.companyMasterID,
    );
  }

  navigateToCompanyTraining(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyMasterComponent',
      this.body,
      '/superadminmenus/company_training',
      rowData.companyMasterID,
    );
  }


  navigateToSubscriptionPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyMasterComponent',
      this.body,
      '/superadminmenus/company_subscription',
      rowData.companyMasterID,
    );
  }
}
