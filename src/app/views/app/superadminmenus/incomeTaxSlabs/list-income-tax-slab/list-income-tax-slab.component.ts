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
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-income-tax-slab',
    templateUrl: './list-income-tax-slab.component.html',
    styleUrls: ['./list-income-tax-slab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListIncomeTaxSlabComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('filter') filter: NgForm;
  scrollBarHorizontal: boolean;
  itemsPerPage: any;

  filterData = {
    page: 1,
    limit: 10,
    incomeTaxSlabMasterID: '',
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
  masterData: any;
  querydata: string;

  currentPage: number;
  formValue: any;
  selectedIncomeTaxSlabMasterID: any;

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
          '/app/superadminmenus/list_incomeTaxSlab',
          '/app/superadminmenus/list_incomeTaxSlab/edit_incomeTaxSlab',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListIncomeTaxSlabComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListIncomeTaxSlabComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        incomeTaxSlabMasterID: '',
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListIncomeTaxSlabComponent.body;
      this.selectedIncomeTaxSlabMasterID = this.filterData.incomeTaxSlabMasterID;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getMasterData();

    this.getAlldata();
    if (this.usertype == 2) {
      this.permissioncreate = [1];
    }
    this.getIPAddress();
  }

  getMasterData() {
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLDATAINCOMETAXSLABMASTER, {}, 'GET', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.masterData = res.data;

            this.spinner.stop('getdata');
          } else {
            this.spinner.stop('getdata');
          }
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('getdata');
        },
      );
  }

  getAlldata() {
    let queryString = `?page=${this.filterData.page}&limit=${this.filterData.limit}`;

    if (this.filterData.incomeTaxSlabMasterID) {
      queryString += `&incomeTaxSlabMasterID=${this.filterData.incomeTaxSlabMasterID}`;
    }

    this.querydata = queryString;

    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLDATAINCOMETAXSLAB + queryString, {}, 'GET', true, true, true)
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

  onSubmit() {
    if (!this.filter.valid) {
      return;
    }
    this.filterData.incomeTaxSlabMasterID = this.filter.value.incomeTaxSlabMasterID;
    this.getAlldata();
  }

  Export() {
    const body = {
      incomeTaxSlabMasterID: this.filterData.incomeTaxSlabMasterID,
    };

    this.spinner.start('a');

    this.api
      .callApi(
        this.constant.GETALLDATAINCOMETAXSLAB + this.querydata + `&export=true`,
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
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'IncomeTaxSlabs.xlsx');

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
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
    this.router.navigate([this.adminRoot + '/superadminmenus/list_incomeTaxSlab/add_incomeTaxSlab']);
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
        this.spinner.start('confirm');
        this.api
          .callApi(
            this.constant.UPDATESTATUSINCOMETAXSLAB + id,
            body,
            'PUT',
            true,
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.getAlldata();
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListIncomeTaxSlabComponent',
      this.filterData,
      '/superadminmenus/list_incomeTaxSlab/edit_incomeTaxSlab',
      rowData.incomeTaxSlabID,
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    this.filter.resetForm();

    this.formValueStorageService.removeData('ListIncomeTaxSlabComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
}
