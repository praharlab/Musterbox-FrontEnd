import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-advance-expense-payment',
    templateUrl: './list-advance-expense-payment.component.html',
    styleUrls: ['./list-advance-expense-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAdvanceExpensePaymentComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    enddate: '',
    startdate: '',
    userMasterID: null,
    searchQuery: '',
    exportData: '',
    companyMasterId: null
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  currentPage: number;
  adminRoot = environment.adminRoot;
  getdata: any;
  formValue: any;
  showbutton: boolean = true;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]
  commonFilterData: any

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/finances/list_advance_payment',
          this.adminRoot + '/finances/list_advance_payment/edit_advance_payment',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAdvanceExpensePaymentComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    })
  }

  ngOnInit() {
    // this.getData();
    this.formValue = this.formValueStorageService.getData();
    this.checkpermission();

    if (this.formValueStorageService.isEmptyObject('ListAdvanceExpensePaymentComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        enddate: '',
        startdate: '',
        userMasterID: null,
        searchQuery: '',
        exportData: '',
        companyMasterId: +localStorage.getItem('company_id')

      };
    } else {
      this.filterData = this.formValue.ListAdvanceExpensePaymentComponent.body;
    }

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
              permissionval.formName == 'ExpensePayment' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpensePayment' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpensePayment' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }


  onSubmit(val?: any) {
    this.commonFilterData = val;
    this.filterData.userMasterID = val?.user && val?.user?.length > 0 ? val?.user : this.filterData.userMasterID;
    this.filterData.startdate = val?.startdate;
    this.filterData.enddate = val?.enddate;
    this.getData();
  }

  getData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETEXPENSEADVANCE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('data');
          } else {
            this.spinner.stop('data');
            this.handleCatchError('something went wrong!');
          }
        },
        (err) => {
          this.spinner.stop('data');
          this.handleCatchError(err.error.message);
        },
      );
  }

  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }
  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getData();
  }

  clear() {
    this.rows = []
    this.commonFilterData = null;
    this.filterData = {
    page: this.formValue.ListAdvanceExpensePaymentComponent?.body?.page ? this.formValue.ListAdvanceExpensePaymentComponent?.body?.page : 1,
    limit: this.formValue.ListAdvanceExpensePaymentComponent?.body?.limit ? this.formValue.ListAdvanceExpensePaymentComponent?.body?.limit : 10,
    enddate: '',
    startdate: '',
    userMasterID: null,
    searchQuery: '',
    exportData: '',
    companyMasterId: +localStorage.getItem('company_id')
  };
  this.formValueStorageService.removeData('ListAdvanceExpensePaymentComponent', false);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();

    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getData();
    }
  }


  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/list_advance_payment/add_advance_payment']);
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListAdvanceExpensePaymentComponent',
      this.filterData,
      '/finances/list_advance_payment/edit_advance_payment',
      rowData.ExpensePaymentID,
    );
  }


  downloadFile() {
    let body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      exportData: true,
      userMasterID: this.datefilter.value.user,
      startdate: this.datefilter.value.startdate,
      enddate: this.datefilter.value.enddate,
      companyMasterId: this.filterData.companyMasterId
    }
    this.spinner.start('download');

    this.api
      .callApi(this.constant.GETEXPENSEADVANCE, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }


  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Advance Expense Payment.xlsx');
    this.spinner.stop('download');
  }

  alertConfirmation(ExpensePaymentID: any) {
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
        this.api.callApi(this.constant.DELETEEEXPENSEADVANCE + ExpensePaymentID, {}, 'DELETE', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.getData();

            } else {
              this.handleError(res.message);
            }
            this.spinner.stop('confirm');
          },
          (err) => {
            this.handleCatchError(err.error.message);
            this.spinner.stop('confirm');
          },
        );
      }
    });
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  }

  SyncIntegration(ExpensePaymentID: any) {
    const id = ExpensePaymentID;
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.ERPSYNCINTEGRATION + id, {},
        'POST',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = [...this.rows];
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getData();
            setTimeout(() => {
              this.spinner.stop('data');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('data');
        },
      )
  }
  
  getCompany(val: any){
    this.filterData.companyMasterId = val
    this.getData();
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

}
