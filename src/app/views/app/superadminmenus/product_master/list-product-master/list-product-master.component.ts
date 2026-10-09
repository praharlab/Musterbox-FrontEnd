import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-product-master',
    templateUrl: './list-product-master.component.html',
    styleUrls: ['./list-product-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListProductMasterComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
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
  permissioncreate = [1];
  events: any;
  excelevents: any;
  limit: number;

  editData: any;
  userrights: any = [];
  editrights: any = [];
  formdata: any;
  showMyContainer: boolean = false;
  companydata: any;

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
          '/app/superadminmenus/product_master',
          '/app/superadminmenus/product_master/edit_product_master',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListProductMasterComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListProductMasterComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListProductMasterComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getProductData();
  }

  getProductData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETPRODUCTDATA, this.filterData, 'POST', true, false, true)
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

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.formValueStorageService.removeData('ListProductMasterComponent', false);
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.ngOnInit();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getProductData();
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

  // onItemsPerPageChange(itemCount): void {
  //   this.itemsPerPage = itemCount;
  // }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getProductData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getProductData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/product_master/add_product_master']);
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
          productMasterID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEPRODUCTDATA, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getProductData();
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
      text: 'Product will be Deleted!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          productMasterID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.PRODUCTSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getProductData();
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
      text: 'product  will be Added!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          productMasterID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.PRODUCTSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.getProductData();
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

  view(id1: any) {
    this.formdata = [];

    this.spinner.start('loader-1');
    this.api.callApi(this.constant.VIEWFORMDATA, {}, 'GET', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.formdata = res.data;
          for (var i = 0; i < this.formdata.length; i++) {
            for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
              this.formdata[i].parentFormMasterID[j].parentid = '';
              this.formdata[i].parentFormMasterID[j].disable = '';
            }
            this.formdata[i].parentid = '';
            this.formdata[i].disable = false;
          }

          for (var i = 0; i < this.formdata.length; i++) {
            this.formdata[i].status = false;
            for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
              this.formdata[i].parentFormMasterID[j].status = false;
              for (var a = 0; a < this.formdata[i].parentFormMasterID[j].operation.length; a++) {
                this.formdata[i].parentFormMasterID[j].operation[a].status = true;
              }
            }
          }

          let id = id1;
          this.spinner.start('start');
          this.api
            .callApi(this.constant.VIEWPRODUCTDATA + id, {}, 'GET', true, true, true)
            .subscribe(
              (res: any) => {
                this.companydata = res.data;

                this.editrights = res.productPermission;
                this.userrights = this.editrights;
                if (this.editrights.length != 0) {
                  for (var i = 0; i < this.formdata.length; i++) {
                    for (var k = 0; k < this.editrights.length; k++) {
                      if (this.formdata[i].formMasterID == this.editrights[k].formMasterID) {
                        this.formdata[i].status = true;
                        this.formdata[i].parentid = this.editrights[k].formMasterID;
                      } else {
                      }
                    }
                  }
                  for (var i = 0; i < this.formdata.length; i++) {
                    for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
                      for (
                        var a = 0;
                        a < this.formdata[i].parentFormMasterID[j].operation.length;
                        a++
                      ) {
                        for (var k = 0; k < this.editrights.length; k++) {
                          if (
                            this.formdata[i].parentFormMasterID[j].formMasterID ==
                            this.editrights[k].formMasterID &&
                            this.formdata[i].parentFormMasterID[j].operation[a].operationID ==
                            this.editrights[k].operationID
                          ) {
                            this.formdata[i].parentFormMasterID[j].parentid =
                              this.editrights[k].formMasterID;
                            this.formdata[i].parentFormMasterID[j].status = true;
                            this.formdata[i].parentFormMasterID[j].operation[a].operationselected =
                              this.editrights[k].operationID;
                            this.formdata[i].parentFormMasterID[j].operation[a].status = true;
                          }
                        }
                      }
                    }
                  }
                }

                this.showMyContainer = true;
                this.spinner.stop('start');
              },
              (err) => {
                this.handleError(err.error.message);
                this.spinner.stop('start');
              },
            );
        }
        this.spinner.stop('loader-1');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('loader-1');
      },
    );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListProductMasterComponent',
      this.filterData,
      '/superadminmenus/product_master/edit_product_master',
      rowData.productMasterID,
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
