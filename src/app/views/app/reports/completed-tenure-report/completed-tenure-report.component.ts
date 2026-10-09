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
    selector: 'app-completed-tenure-report',
    templateUrl: './completed-tenure-report.component.html',
    styleUrls: ['./completed-tenure-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CompletedTenureReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  expenseTypeArrayForDropDown: any = expenseTypeArrayForDropDown;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    month: null,
    userMasterID: [],
    exportData: false,
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
  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.Project,
    CommonFilterFields.EmployementType,
  ];

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
              permissionval.formName == 'CompletedTenureReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getCompletedTenureReportData() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.COMPLETEDTENSUREREPORT, this.filterData, 'POST', true, false, true)
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
    this.getCompletedTenureReportData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getCompletedTenureReportData();
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
        month: null,
        userMasterID: [],
        exportData: false,
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

  download() {
    this.filterData.exportData = true;
    this.spinner.start('download');
    this.api
      .callApi(
        this.constant.COMPLETEDTENSUREREPORT,
        this.filterData,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.filterData.exportData = false;
          this.downloadFileService.handleFileDownload(
            res,
            'Completed Tenure Report.xlsx',
            'text/xlsx',
          );
          this.spinner.stop('download');
        },
        (err) => {
          this.filterData.exportData = false;
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
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.month = val?.month;
    this.filterData.exportData = false;
    this.getCompletedTenureReportData();
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
