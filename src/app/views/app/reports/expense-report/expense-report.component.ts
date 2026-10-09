import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import {
  CommonFilterFields,
  CommonFilterButtonFields,
  ItemOptionsPerPageArray,
  CommonRequiredFields,
} from 'src/app/constants/CommonFilterFields';
import { expenseTypeArrayForDropDown } from 'src/app/constants/commonVariables';
import { environment } from 'src/environments/environment';
import { CommonUtils } from 'src/app/utils/common.utils';
@Component({
    selector: 'app-expense-report',
    templateUrl: './expense-report.component.html',
    styleUrls: ['./expense-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExpenseReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  expenseTypeArrayForDropDown: any = expenseTypeArrayForDropDown;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    fromDate: '',
    toDate: '',
    userMasterID: null,
    expenseType: '',
    status: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];
  resultColumns: any[];
  visit: boolean;
  tour: boolean;
  ExpenseAccepted: any;
  ExpensePending: any;
  ExpenseRejected: any;
  dataVerify: number;
  ExpensePaid: number;
  showImage: any;
  checkedValue: boolean = false;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company]
  apiURL = environment.apiUrl;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {}
  ngOnInit() {
    this.checkpermission();
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
              permissionval.formName == 'ExpenseReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  onSubmit(val?: any) {
    this.resultColumns = [];
    this.filterData.companyMasterID = val?.company;
    if (val?.expensetype == 'Visit') {
      this.visit = true;
      this.tour = false;
    }
    if (val?.expensetype == 'Tour') {
      this.tour = true;
      this.visit = false;
    }
    if (val?.expensetype == 'All') {
      this.tour = true;
      this.visit = true;
    }
    if (val?.expensetype == null) {
      this.filterData.expenseType;
    }

    this.dataVerify = CommonUtils.calculateDateDifferenceInDays(
      new Date(val?.todate),
      new Date(val?.fromdate),
    );

    if (this.dataVerify < 0) {
      return this.commonNotificationService.handleWarning(
        'Please Select Correct FromDate And toDate',
      );
    }
    this.filterData.fromDate = val?.fromdate;
    this.filterData.toDate = val?.todate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.expenseType = val?.expensetype;
    this.filterData.status = val?.status;

    this.getExpenseReport();
  }

  getExpenseReport() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.EXPENSEREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.rows = res.data;
        if (this.rows.length > 0) {
          this.showButtons.push(CommonFilterButtonFields.Excel);
          this.showButtons.push(CommonFilterButtonFields.CSV);
          this.showButtons.push(CommonFilterButtonFields.Pdf);
          this.showButtons.push(CommonFilterButtonFields.SENDMAIL);
        } else {
          this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
        }
        this.page.totalCount = res.totalcount;

        this.ExpenseAccepted = res.userExpenseCalculations.Accepted
          ? res.userExpenseCalculations.Accepted
          : 0;
        this.ExpensePending = res.userExpenseCalculations.Pending
          ? res.userExpenseCalculations.Pending
          : 0;
        this.ExpenseRejected = res.userExpenseCalculations.Rejected
          ? res.userExpenseCalculations.Rejected
          : 0;
        this.ExpensePaid = res.userExpenseCalculations.Paid ? res.userExpenseCalculations.Paid : 0;

        this.temp = [this.rows];
        this.page.totalCount = res.totalcount;
        this.spinner.stop('submit');
      });
  }
  onCheckChange() {
    if (this.checkedValue) {
      this.showButtons = this.showButtons.filter((e) => e != CommonFilterButtonFields.CSV);
    } else {
      this.showButtons.push(CommonFilterButtonFields.CSV);
    }
  }
  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getExpenseReport();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getExpenseReport();
  }

  updateFilter(event): void {
    const val = event.target.value.toLowerCase().trim();
    const count = this.resultColumns.length;
    const keys = Object.keys(this.temp[0]);
    const temp = this.temp.filter((item) => {
      for (let i = 0; i < count; i++) {
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          return true;
        }
      }
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  clear() {
    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: null,
        fromDate: '',
        toDate: '',
        userMasterID: null,
        expenseType: '',
        status: '',
      };
      this.checkedValue = false;
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
      this.ngOnInit();
    }, 200);
  }

  download(fileType) {
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      userMasterID: this.filterData.userMasterID,
      expenseType: this.filterData.expenseType,
      status: this.filterData.status,
      exportData: true,
      exportFileType: this.checkedValue ? 'xlsx' : fileType,
      withAttachment: this.checkedValue,
    };

    this.spinner.start('download');
    this.api.callApi(this.constant.EXPENSEREPORT, body1, 'POST', true, false, true, true).subscribe(
      (res: any) => {
        if (fileType == 'csv' && this.checkedValue == false) {
          this.downloadFileService.handleFileDownload(res, 'Expense Report.csv', 'text/csv');
        } else {
          this.downloadFileService.handleFileDownload(res, 'Expense Report.xlsx', 'text/xlsx');
        }
        this.spinner.stop('download');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('download');
      },
    );
  }

  downloadMail() {
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      userMasterID: this.filterData.userMasterID,
      expenseType: this.filterData.expenseType,
      status: this.filterData.status,
      exportData: true,
      exportFileType: 'csv',
      sendMail: true,
      sendMailID: +localStorage.getItem('id'),
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.EXPENSEREPORT, body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 401) {
          this.commonNotificationService.handleError(res.message);
        } else {
          this.commonNotificationService.handleSuccess('Mail sent Successfully');
        }
        this.spinner.stop('download');
      });
  }

  viewAttachment(attachment: any) {
    window.open(this.apiURL + attachment, '_blank');
  }
  pdfData: string;

  downloadPDF() {
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      userMasterID: this.filterData.userMasterID,
      expenseType: this.filterData.expenseType,
      status: this.filterData.status,
      exportData: true,
      exportFileType: 'PDF',
    };

    this.spinner.start('download');
    this.api.callApi(this.constant.EXPENSEREPORT, body1, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.pdfData = 'data:application/pdf;base64,' + res.data;
          this.onClickDownloadPdf();
        }
        this.spinner.stop('download');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.start('download');
      },
    );
  }

  downloadPdfData(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  onClickDownloadPdf() {
    let base64String = this.pdfData;
    this.downloadPdfData(base64String, 'Expense Report');
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
