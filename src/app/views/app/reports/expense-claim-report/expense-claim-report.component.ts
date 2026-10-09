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
    selector: 'app-expense-claim-report',
    templateUrl: './expense-claim-report.component.html',
    styleUrls: ['./expense-claim-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExpenseClaimReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  expenseTypeArrayForDropDown: any = expenseTypeArrayForDropDown;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    fromDate: '',
    toDate: '',
    userMasterID: null,
    expenseType: '',
    status: [],
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];
  resultColumns: any[];
  visit: boolean;
  tour: boolean;
  dataVerify: number;
  showImage: any;
  checkedValue: boolean = false;
  hideFilters: CommonFilterFields[] = [];

  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company];
  apiURL = environment.apiUrl;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
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
              permissionval.formName == 'ExpenseClaimReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getExpenseReport() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.EXPNESECLAIMREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.rows = res.data;
        if (this.rows.length > 0) {
          this.showButtons.push(CommonFilterButtonFields.Excel);
        } else {
          this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
        }
        this.page.totalCount = res.totalcount;
        this.temp = [this.rows];
        this.page.totalCount = res.totalcount;
        this.spinner.stop('submit');
      });
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
        status: [],
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
    this.api.callApi(this.constant.EXPNESECLAIMREPORT, body1, 'POST', true, false, true, true).subscribe(
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

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  } onSubmit(val?: any) {
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
    this.filterData.status = val?.expenseStatus || [];

    this.getExpenseReport();
  }

}
