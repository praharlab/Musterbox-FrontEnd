import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-list-tour',
    templateUrl: './list-tour.component.html',
    styleUrls: ['./list-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTourComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['ToursMasterID', 'TourName', 'FromDate', 'ToDate', 'Status'];
  SelectionType = SelectionType;
  tabledata = [
    'ToursMasterID',
    'TourName',
    'FromDate',
    'ToDate',
    'TotalDays',
    'UserMasterID',
    'Status',
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
    startdate: '',
    enddate: '',
    userMasterID: localStorage.getItem('id'),
    searchQuery: '',
  };
  // body = {
  //   page: 1,
  //   limit: 10,
  //   searchQuery: '',
  //   userid: localStorage.getItem('id'),
  // };
  // body1 = {
  //   page: 1,
  //   limit: 10,
  //   startdate: '',
  //   enddate: '',
  //   userid: localStorage.getItem('id'),
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
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/tour',
          this.adminRoot + '/masters/tour/edit_tour',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListBankMasterComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListTourComponent') || (Object.keys(this.formValue.ListTourComponent.body).length === 0 && this.formValue.ListTourComponent.body.constructor === Object)) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        userMasterID: localStorage.getItem('id'),
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListTourComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.gettourdata();
    this.checkpermission();
  }


  gettourdata() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETTOURDATA, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
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
              permissionval.formName == 'Tour' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return permissionval.formName == 'Tour' && permissionval.operationName.includes('Edit');
          });
          this.permissionview = permission.filter((permissionval) => {
            return permissionval.formName == 'Tour' && permissionval.operationName.includes('View');
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Tour' && permissionval.operationName.includes('Create')
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
        this.gettourdata();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.gettourdata();
    }
  }

  onSubmit() {

    if (!this.datefilter.valid) {
      return;
    }


    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

   this.gettourdata();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.gettourdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.gettourdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/visits/tour/add_tour/']);
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
        this.api.callApi(this.constant.DELETETOURDATA + id, {}, 'GET', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.gettourdata();
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
      text: 'Record will be deactivated!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deactivate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          ToursMasterID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.TOURSTATUSCHANGES, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.gettourdata();
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
      text: 'Record will be activated!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          ToursMasterID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.TOURSTATUSCHANGES, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.gettourdata();
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

    this.formValueStorageService.removeData('ListTourComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
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
      'ListTourComponent',
      {...this.filterData, navigatedFrom: '/visits/tour'},
      '/visits/tour/edit_tour',
      rowData.ToursMasterID,
    );
  }
}
