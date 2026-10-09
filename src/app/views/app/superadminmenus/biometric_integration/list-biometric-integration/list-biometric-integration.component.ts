import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-biometric-integration',
    templateUrl: './list-biometric-integration.component.html',
    styleUrls: ['./list-biometric-integration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListBiometricIntegrationComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['CompanyName', 'biometricSerialNo', 'databaseName', 'tableName'];
  SelectionType = SelectionType;
  tabledata = [
    'CompanyName',
    'biometricSerialNo',
    'databaseName',
    'tableName',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    company: '',
    database: '',
    searchQuery: '',
    table: '',
  };
  // body = {
  //   page: 1,
  //   limit: 10,
  //   searchQuery: '',
  // };
  // body1 = {
  //   page: 1,
  //   limit: 10,
  //   company: '',
  //   database: '',
  //   searchQuery: '',
  //   table: '',
  // };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  // filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  childcompany: string;
  comp: any;
  db: any;
  tabled: any;

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
          '/app/superadminmenus/biometric_integration',
          '/app/superadminmenus/biometric_integration/edit_biometric_integration',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListBiometricIntegrationComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListBiometricIntegrationComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        company: '',
        database: '',
        searchQuery: '',
        table: '',
      };
    } else {
      this.filterData = this.formValue.ListBiometricIntegrationComponent.body;
    }

    this.getdata();
    this.checkpermission();
    this.getcompany();
  }
  getbio(id: any) {
    const body = {
      companyMasterID: id,
    };
    this.spinner.start('bio');
    this.api
      .callApi(this.constant.GETTABLEANDDB, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.db = res.data;
          this.spinner.stop('bio');
        }
      });
  }
  getcompany() {
    const body = {
      page: '',
      limit: '',
    };
    this.spinner.start('comp');
    this.api
      .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('comp');
        }
      });
  }
  getdata() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETALLBIOMETRICINTEGRATION, this.filterData, 'POST', true, false, true)
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
    if (this.usertype != 2) {
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


  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.company = this.datefilter.value.company;
    this.filterData.database = this.datefilter.value.database;

    this.api
      .callApi(this.constant.GETALLBIOMETRICINTEGRATION, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListBiometricIntegrationComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getdata();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    // if(this.childcompany=='false')
    // {
    this.router.navigate([this.adminRoot + '/superadminmenus/biometric_integration/add_biometric_integration']);

    // }
    // else
    // {
    //   Swal.fire(
    //     'Permission Denied.',
    //     'Contact to admin..',
    //     'error'
    //   )
    // }
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
          biometricIntegrationID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEBIOMETRICINTEGRATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.added == 1) {
              } else {
                this.handleError(res.message)
                setTimeout(() => {
                  //this.router.navigate(['app/bank']);
                  this.spinner.stop();
                }, 3000);
              }
              this.getdata();
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message)
              this.spinner.stop();
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
          biometricIntegrationID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.STATUSCHANGEBIOMETRICINTEGRATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
             
              this.getdata();
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message)
              this.spinner.stop();
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
          biometricIntegrationID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.STATUSCHANGEBIOMETRICINTEGRATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getdata();
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message)
              this.spinner.stop();
            },
          );
      }
    });
  }

  clear() {
    window.location.reload();
  }

  changeshowfields() {
    this.ngOnInit();
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListBiometricIntegrationComponent',
      this.filterData,
      '/superadminmenus/biometric_integration/edit_biometric_integration',
      rowData.biometricIntegrationID,
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
