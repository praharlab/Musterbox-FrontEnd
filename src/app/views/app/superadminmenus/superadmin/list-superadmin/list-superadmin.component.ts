import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-superadmin',
    templateUrl: './list-superadmin.component.html',
    styleUrls: ['./list-superadmin.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListSuperadminComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
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
  ipAddress: any;
  rows1: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  usertype: any;

  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/superadmin',
          '/app/superadminmenus/superadmin/edit_superadmin',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListSuperadminComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListSuperadminComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListSuperadminComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getSuperAdminData();
    this.file = [];
    this.checkpermission();
    this.getIPAddress();
  }

  getSuperAdminData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETCOMPANYCONTACTDATA2, this.filterData, 'POST', true, false, true)
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
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
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
                permissionval.formName == 'EmployeeMaster' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'EmployeeMaster' &&
                permissionval.operationName.includes('Edit')
              );
            });
            this.permissionview = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'EmployeeMaster' &&
                permissionval.operationName.includes('View')
              );
            });
            this.permissioncreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'EmployeeMaster' &&
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

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListSuperadminComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getSuperAdminData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getSuperAdminData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getSuperAdminData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/superadmin/add_superadmin']);
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
          userMasterID: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEOMPANYCONTACTDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getSuperAdminData();
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
          userMasterID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.COMPANYCONTACTSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getSuperAdminData();
              this.spinner.stop('deactive');
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
          userMasterID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.COMPANYCONTACTSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getSuperAdminData();
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }



  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListSuperadminComponent',
      this.filterData,
      '/superadminmenus/superadmin/edit_superadmin',
      rowData.userMasterID,
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
