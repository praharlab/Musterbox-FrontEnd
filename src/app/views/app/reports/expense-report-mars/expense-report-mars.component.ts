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
    selector: 'app-expense-report-mars',
    templateUrl: './expense-report-mars.component.html',
    styleUrls: ['./expense-report-mars.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExpenseReportMarsComponent implements OnInit {
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
    status: null,
    expenseCategoryId: null,
    projectID: [],
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
  expensecategory: any = [];
  allProject: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {}

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
              permissionval.formName == 'ExpenseReportMARS' &&
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
      .callApi(this.constant.EXPNESEREPORTMARS, this.filterData, 'POST', true, false, true)
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
        status: null,
        expenseCategoryId: null,
        projectID: [],
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
      status: this.filterData.status,
      exportData: true,

    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.EXPNESEREPORTMARS, body1, 'POST', true, false, true, true)
      .subscribe(
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
  }

  onSubmit(val?: any) {
    this.resultColumns = [];
    this.filterData.companyMasterID = val?.company;

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
    this.filterData.status = val?.expenseStatus || null;
    this.filterData.expenseCategoryId = val?.expenseCategoryId || null;
    this.filterData.projectID = val?.expenseProjectIDs || [];

    this.getExpenseReport();
  }

  getCompany(companyMasterID: number) {
    this.filterData.companyMasterID = companyMasterID;
    this.expensecategory = [];
    if (!companyMasterID) return;
    this.getexpensecategory();
    this.getProjectData();
  }
  getexpensecategory() {
    this.api
      .callApi(
        this.constant.EXPENSECATEGORYBYCOMPANYDATA1 + this.filterData.companyMasterID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.expensecategory = res.data;
          this.spinner.stop();
        }
      });
  }

  getProjectData() {
    const filterData = {
      companyMasterID: this.filterData.companyMasterID,
    };
    this.spinner.start('users');
    this.api.callApi(this.constant.LISTPROJECT, filterData, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allProject = res.data;
        }
        this.spinner.stop('users');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

    getBranchName(row: any): string {
    return row.employeeBranches?.[0]?.branchMaster?.branchName || '';
  }
  getEmployeeCode(row: any): string {
    return row.employeeJoiningDetails[0]?.employeeCode || '';
  }

  getDepartmentName(row: any): string {
    return row.employeeDepartments?.[0]?.department?.departmentName || '';
  }

  getDesignationName(row: any): string {
    return row.employeeDesignations?.[0]?.designation?.designationName || '';
  }

  getDivisionName(row: any): string {
    return row.employeeDivisions?.[0]?.division?.divisionName || null;
  }
  getWorkingAreaName(row: any): string {
    return row.employeeWorkingAreas?.[0]?.workingArea?.workingAreaName || null;
  }
}
