import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-income-tax-slab-master',
    templateUrl: './list-income-tax-slab-master.component.html',
    styleUrls: ['./list-income-tax-slab-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListIncomeTaxSlabMasterComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  scrollBarHorizontal: boolean;
  itemsPerPage: any;

  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
  };
  adminRoot = environment.adminRoot;
  rows: any = [];
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  excelevents: any;

  itemOptionsPerPage = ItemOptionsPerPageArray;
  limit = 10;
  permissioncreate = [];

  usertype: any;
  ipAddress: any;

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
          '/app/superadminmenus/list_incomeTaxSlabMaster',
          '/app/superadminmenus/list_incomeTaxSlabMaster/edit_incomeTaxSlabMaster',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListIncomeTaxSlabMasterComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListIncomeTaxSlabMasterComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListIncomeTaxSlabMasterComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAlldata();
    if (this.usertype == 2) {
      this.permissioncreate = [1];
    }
    this.getIPAddress();
  }

  getAlldata() {
    let queryString = `?page=${this.filterData.page}&limit=${this.filterData.limit}`;

    if (this.filterData.searchQuery) {
      queryString += `&searchQuery=${this.filterData.searchQuery}`;
    }

    this.spinner.start('getdata');
    this.api
      .callApi(
        this.constant.GETALLDATAINCOMETAXSLABMASTER + queryString,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('getdata');
          } else {
            this.handleError(res.message);
            this.spinner.stop('getdata');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getdata');
        },
      );
  }

  updateFilter(event) {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListIncomeTaxSlabMasterComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAlldata();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAlldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAlldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/list_incomeTaxSlabMaster/add_incomeTaxSlabMaster']);
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
          status: 2,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api
          .callApi(
            this.constant.UPDATESTATUSINCOMETAXSLABMASTER + id,
            body,
            'PUT',
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getAlldata();
              } else {
                this.handleError(res.message);
                this.getAlldata();
              }

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
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Income Tax Slab Master will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          status: 0,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api
          .callApi(
            this.constant.UPDATESTATUSINCOMETAXSLABMASTER + id,
            body,
            'PUT',
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getAlldata();
              } else {
                this.handleError(res.message);
                this.getAlldata();
              }

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
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Income Tax Slab Master will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          status: 1,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start();
        this.api
          .callApi(
            this.constant.UPDATESTATUSINCOMETAXSLABMASTER + id,
            body,
            'PUT',
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getAlldata();
              } else {
                this.handleError(res.message);
                this.getAlldata();
              }

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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListIncomeTaxSlabMasterComponent',
      this.filterData,
      '/superadminmenus/list_incomeTaxSlabMaster/edit_incomeTaxSlabMaster',
      rowData.incomeTaxSlabMasterID,
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
