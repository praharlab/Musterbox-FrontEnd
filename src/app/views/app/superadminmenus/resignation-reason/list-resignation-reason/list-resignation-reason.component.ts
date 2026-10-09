import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-resignation-reason',
    templateUrl: './list-resignation-reason.component.html',
    styleUrls: ['./list-resignation-reason.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListResignationReasonComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Leave Id', prop: 'LeaveID' },
    { name: 'Leave Name', prop: 'LeaveName' },
    { name: 'Description', prop: 'LeaveDesc' },
    { name: 'status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
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
  product: any = [];
  usertype: any;
  company_id: any;
  rows1: any = [];
  permissioncreate = [1];

  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/superadminmenus/list-resignation-reason',
          '/app/superadminmenus/list-resignation-reason/edit-resignation-reason',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListResignationReasonComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.getAllReason();
  }

  getAllReason() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.LISTRESIGNATIONREASON, this.filterData, 'POST', true, false, true)
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
      this.formValueStorageService.removeData('ListResignationReasonComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAllReason();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllReason();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllReason();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/list-resignation-reason/add-resignation-reason/']);
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
          resigantionReasonID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETERESIGNATIONREASON, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.getAllReason();
                this.spinner.stop();
              } else {
                this.handleError(res.message);
                this.spinner.stop();
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'LeaveName will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          LeaveID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.LEAVEMASTERSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.getAllReason();
                this.spinner.stop();
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop();
              }
            },
            (err) => {
              this.handleError(err.error.message);

              this.spinner.stop();
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'LeaveName will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          LeaveID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.LEAVEMASTERSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getAllReason();
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

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListResignationReasonComponent',
      this.filterData,
      '/superadminmenus/list-resignation-reason/edit-resignation-reason',
      rowData.resigantionReasonID,
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
