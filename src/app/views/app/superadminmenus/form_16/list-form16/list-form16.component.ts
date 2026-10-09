import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-form16',
    templateUrl: './list-form16.component.html',
    styleUrls: ['./list-form16.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListForm16Component implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  mediumDateFormat = environment.mediumDateFormat;
  adminRoot = environment.adminRoot;

  columns = [
    //{ name: 'SR', prop: 'SR' },
    { name: 'Details of Salary', prop: 'SalaryDetails' },
    { name: 'Series', prop: 'Series' },
    { name: 'Parent Form 16', prop: 'ParentForm16ID' },
    { name: 'Start Date', prop: 'StartDate' },
    { name: 'End Date', prop: 'EndDate' },
    { name: 'Gross Amount', prop: 'GrossAmount' },
    { name: 'Qualifying Amount', prop: 'QualifyingAmount' },
    { name: 'Qualifying Amount', prop: 'QualifyingAmount' },
  ];

  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    limit: 10,
    page: 1,
    searchQuery: '',
  };
  page = {
    count: 0,
    offset: 0,
  };
  permissioncreate = [1];

  limit = 10;
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
        const protectedRoutes = ['/app/superadminmenus/form16', '/app/superadminmenus/form16/edit_form16'];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListForm16Component', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListForm16Component')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListForm16Component.body;
    }

    this.limit = 10;
    this.page = {
      count: 0,
      offset: 0,
    };

    this.getFormData();
  }

  getFormData() {
    this.spinner.start('data');
    this.api.callApi(this.constant.GETFORM16, this.filterData, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.count = res.count;
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

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListForm16Component', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getFormData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getFormData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getFormData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/form16/add_form16']);
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
          Form16ID: id, //ID
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEFORM16, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getFormData();
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
          Form16ID: id,
          status: 1,
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.FORM16STATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getFormData();
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
          Form16ID: id,
          status: 0,
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.FORM16STATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getFormData();
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

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListForm16Component',
      this.filterData,
      '/superadminmenus/form16/edit_form16',
      rowData.Form16ID,
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
