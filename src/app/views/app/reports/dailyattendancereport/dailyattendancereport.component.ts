import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

import { CommonFilterFields, CommonFilterButtonFields, ItemOptionsPerPageArray, CommonRequiredFields } from 'src/app/constants/CommonFilterFields';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { CommonUtils } from 'src/app/utils/common.utils';
@Component({
    selector: 'app-dailyattendancereport',
    templateUrl: './dailyattendancereport.component.html',
    styleUrls: ['./dailyattendancereport.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DailyattendancereportComponent implements OnInit {
  page = {
    totalCount: 0,
    offset: 0,
  };
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
  permissionview: any = [];
  datesArray: any[];
  attendancedata: any = [];
  currentPage: number;
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
              permissionval.formName == 'AttendanceRegister-1' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('loader');
        }
      });
  }

  clear() {
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
  }


  onSubmit(val?:any) {
    this.datesArray = CommonUtils.getDatesFromDateRange(
      new Date(val?.fromdate),
      new Date(val?.todate),
    );

    this.filterData.page = 1;
    this.filterData.companyMasterID = val?.company;
    this.filterData.fromdate = val?.fromdate;
    this.filterData.todate = val?.todate;
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.reprttype = val?.reprttype
    this.getAttendacneReportData();
  }

  getAttendacneReportData() {
    this.api
      .callApi(this.constant.ATTENDANCEREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.attendancedata = res.data;

          if (this.attendancedata.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
            this.showButtons.push(CommonFilterButtonFields.CSV);
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


  download(fileType: any) {
    let body = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      fromdate: this.filterData.fromdate,
      todate: this.filterData.todate,
      userMasterID: this.filterData.userMasterID,
      generateExcelFile: this.filterData.reprttype == 'dailyattendance' ? '1' : '2', //Static Excel code for Register 1
      exportFileType: fileType,
    };

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.ATTENDANCEREPORT, body, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (fileType == 'csv') {
          this.downloadFileService.handleFileDownload(res,'Attendance Register 1.csv','text/csv')
        } else {
          this.downloadFileService.handleFileDownload(res,'Attendance Register 1.xlsx','text/xlsx')
        }
        this.spinner.stop('loader');
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.page;
      this.getAttendacneReportData();

    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAttendacneReportData();

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
