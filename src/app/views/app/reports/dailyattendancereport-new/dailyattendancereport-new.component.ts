import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { CommonFilterFields, CommonFilterButtonFields, ItemOptionsPerPageArray, CommonRequiredFields } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { CommonUtils } from 'src/app/utils/common.utils';
@Component({
    selector: 'app-dailyattendancereport-new',
    templateUrl: './dailyattendancereport-new.component.html',
    styleUrls: ['./dailyattendancereport-new.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DailyattendancereportNewComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('table1') table1: ElementRef;
  page = {
    totalCount: 0,
    offset: 0,
  };
  alldepartment: any;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    fromdate: '',
    todate: '',
    userMasterID: null,
    reprttype: null

  };
  empty: any = '-';
  company1: any;
  designation1: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  SelectionType = SelectionType;
  allbranch: any = [];
  alluser: any;
  datesArray: any[];
  selected: any = [];
  selected1: any = [];
  selected2: any = [];
  selected3: any = [];
  attendancedata: any = [];
  branchfilter: boolean = false;
  employee: any;
  employeedata: any;
  selected4: any[];
  enddate: Date;
  requiredField: boolean = false;
  selectedItems = [];
  selectedBranch: any;
  selectedDepartment: any;
  selectedUsers: any = [];
  selectedValue: string;
  currentPage: number;
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: []
  }
  allWorkingArea: any;
  allDivision: any;
  alldesignation: any;
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  isResetForm: boolean = false;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit() {
    this.checkpermission();
  }


  checkpermission() {
    this.spinner.start('loader');
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
              permissionval.formName == 'AttendanceRegister-2' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('loader');
        }
      });
  }


  clear() {
    this.isResetForm = true;

    setTimeout(() => {
      this.attendancedata = [];
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: '',
        fromdate: '',
        todate: '',
        userMasterID: null,
        reprttype: null

      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
      this.ngOnInit();
    }, 200);
    this.isResetForm = false;
  }

  onSubmit(val?: any) {

    this.datesArray = CommonUtils.getDatesFromDateRange(
      new Date(val?.fromdate),
      new Date(val?.todate),
    );

    this.filterData.companyMasterID = val?.company;
    this.filterData.fromdate = val?.fromdate;
    this.filterData.todate = val?.todate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.reprttype = val?.reprttype;
    this.getAttendaceReportData()
  }
getAttendaceReportData(){
  this.spinner.start('loader');

  this.api
  .callApi(this.constant.ATTENDANCEREPORT, this.filterData, 'POST', true, false, true)
  .subscribe((res: any) => {
    if (res.status == 200) {
      this.attendancedata = res.data;
      if (this.attendancedata.length > 0) {
        this.showButtons.push(CommonFilterButtonFields.Excel);
        this.showButtons.push(CommonFilterButtonFields.CSV);
        this.showButtons.push(CommonFilterButtonFields.EXCELWITHLOGS);
      } else {
        this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
      }
        this.page.totalCount = res.totalCount;
        setTimeout(() => {
          this.currentPage = this.filterData.page;
        }, 100);
      

      this.spinner.stop('loader');
    }
  });
}

  export() {
    const body = {
      page: '',
      limit: '',
      companyid: this.filterData.companyMasterID,
      fromdate: this.filterData.fromdate,
      todate: this.filterData.todate,
      userMasterID: this.filterData.userMasterID,
      generateExcelFile: this.filterData.reprttype == 'dailyattendance' ? '6' : '7', //Static Excel code for Register 2
      exportFileType: 'xlsx',
    };

    this.generateExcel(body, 'Attendance Register With Logs', 'xlsx');
  }
  download(fileType: string) {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      fromdate: this.filterData.fromdate,
      todate: this.filterData.todate,
      userMasterID: this.filterData.userMasterID,
      generateExcelFile: this.filterData.reprttype == 'dailyattendance' ? '3' : '4', //Static Excel code for Register 2
      exportFileType: fileType,
    };
    this.generateExcel(body, 'Attendance Register 2', fileType);
  }

  generateExcel(body: any, fileName: string, fileType: string) {
    this.spinner.start('loader');
    this.api
      .callApi(this.constant.ATTENDANCEREPORT, body, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (fileType == 'csv') {
          this.downloadFileService.handleFileDownload(res, `${fileName}.csv`, 'text/csv')
        } else {
          this.downloadFileService.handleFileDownload(res, `${fileName}.xlsx`, 'text/xlsx')
        }
        this.spinner.stop('loader');
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.page;
      this.getAttendaceReportData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAttendaceReportData();
    } else {
      console.log('error');
    }
  }

  checkColor(item: any) {
    if (item.attendancetype == 'P') return 'present';
    if (item.attendancetype == 'A') return 'absent';
    if (item.attendancetype == 'HD') return 'halfday';
    if (item.attendancetype == '-') return 'absent';
    if (item.attendancetype == 'MissPunch') return 'notpunchout';
    if (item.attendancetype.includes('weekoff')) return 'weekoff';
    if (item.attendancetype.includes('holiday')) return 'holiday';
    if (item.attendancetype.includes('Optional')) return 'holiday';
    if (
      item.attendancetype.includes('P') &&
      (item.PenaltyDeduction || item.goEarlyPanaltyDeduction)
    )
      return 'penaltywithdeduction';
    if (
      item.attendancetype.includes('P') &&
      (item.attendancetype.includes('P') || item.attendancetype.includes('P'))
    )
      return 'penaltywithoutdeduction';

    return 'leave';
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
