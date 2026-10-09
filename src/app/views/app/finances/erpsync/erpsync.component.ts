import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../../../services/api.service';
import { ConstantService } from '../../../../services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-erpsync',
    templateUrl: './erpsync.component.html',
    styleUrls: ['./erpsync.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ErpsyncComponent implements OnInit {
  @ViewChild('filterdata') filterdata: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  filterData = {
    page: 1,
    limit: 100,
    companyMasterID: +localStorage.getItem('company_id'),
    userMasterID: null,
    expense_date: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows: any = [];
  permissioncreate: any = [];
  scrollBarHorizontal = window.innerWidth < 1201;
  //type = SelectionType.checkbox
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  dataselected: any = [];
  newArray: any = [];
  permissionview: any = [];
  permissionsync: any = [];
  alldata1: any;
  expense_accountHeadIDArr = [];
  expense_accountHeadID: any;
  getting_expense_accounthead_str: any;
  showbutton: boolean = true;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,

  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.getExpenseSyncData();
    this.checkpermission();
    this.getAllUserUser();
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ErpSync' && permissionval.operationName.includes('View')
            );
          });
          this.permissionsync = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ErpSync' && permissionval.operationName.includes('Sync')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getAllUserUser() {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: +localStorage.getItem('company_id'),
    };
    this.spinner.start('getuser');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldata1 = res.data;
          this.spinner.stop('getuser');
        }
      });
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getExpenseSyncData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getExpenseSyncData()
  }

  onSubmit() {
    if (!this.filterdata.valid) {
      return;
    }
    this.filterData.userMasterID = this.filterdata.value.userMasterID;
    this.filterData.expense_date = this.filterdata.value.expensedate;
    this.getExpenseSyncData()
  }

  getExpenseSyncData() {

    this.spinner.start('filter');
    this.api
      .callApi(this.constant.GETERPSYNC_V2, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.showbutton = true;
          this.page.totalCount = res.totalcount;
          this.spinner.stop('filter');
        }
      });
  }

  alertSyncConfirmation(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sync it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showbutton = false;
        const data = [{
          erpAcountID: row.erpAcountID,
          netAmount: row.netAmount,
          expenseAmountheadwise: row.expenseAmountheadwise,
          expense_date: row.expense_date,
          accountHeadID: row.accountHeadID,
          description: row.description,
          userMasterID: row.userMasterID,
          userExpenseTransactionIDs: row.userExpenseTransactionIDs
        }];
        const body = {
          tobeSyncedExpenseData: data
        }
        this.spinner.start('sync');
        this.api
          .callApi(this.constant.UPDATEEXPENSEERP, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message)
                this.spinner.stop('sync');
                this.getExpenseSyncData();
              } else {
                this.commonNotificationService.handleError(res.message)
                this.spinner.stop('sync');
                this.getExpenseSyncData();
              }
              this.showbutton = true;
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message)
              this.spinner.stop('sync');
              this.showbutton = true;

              this.getExpenseSyncData();
            },
          );

      }
    });
  }

  clear() {
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 100,
      companyMasterID: +localStorage.getItem('company_id'),
      userMasterID: null,
      expense_date: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.getExpenseSyncData()
  }

  refresh() {
    window.location.reload();
  }

  findExpesneWithNegativeJvID() {
    const body = {
      companyMasterID: +localStorage.getItem('company_id'),
    };

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETWITHNEGATIVEJVID, body, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.commonNotificationService.handleWarning('No data found to export!')
            this.spinner.stop('a');
          } else {
            this.downloadFileService.handleFileDownload(res, 'Negative ERPJVID Data.xlsx', 'text/xlsx')
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message || 'Someting Went Wrong!')
          this.spinner.stop('a');
        },
      );
  }

  findUnassigedERPAccountData() {
    const body = {
      companyMasterID: +localStorage.getItem('company_id'),
    };

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETUNASSIGNEDERPACCOUTEXPENSE, body, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.commonNotificationService.handleWarning('No data found to export!')
            this.spinner.stop('a');
          } else {
            this.downloadFileService.handleFileDownload(res, 'Un-assigned Erp Account Expense.xlsx', 'text/xlsx')
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message || 'Someting Went Wrong!')
          this.spinner.stop('a');
        },
      );
  }
}
