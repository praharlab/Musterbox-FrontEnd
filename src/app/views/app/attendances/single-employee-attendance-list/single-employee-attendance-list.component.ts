import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { direction } from 'html2canvas/dist/types/css/property-descriptors/direction';
import { ChangeDetectorRef } from '@angular/core';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-single-employee-attendance-list',
    templateUrl: './single-employee-attendance-list.component.html',
    styleUrls: ['./single-employee-attendance-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SingleEmployeeAttendanceListComponent implements OnInit {
  @ViewChild('filterdate') filterdate: NgForm;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    id: localStorage.getItem('filterUser')
      ? +localStorage.getItem('filterUser')
      : +localStorage.getItem('id'),
  };

  body1 = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    id: localStorage.getItem('filterUser')
      ? +localStorage.getItem('filterUser')
      : +localStorage.getItem('id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  tabledata = [];
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  field: any;
  allvalue: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  companyid: any;

  enddate: Date;
  log: any;
  attendanceForm: any;
  CalendarStartDate: string;
  CalendarEndDate: string;

  radiostatus: any = '2';
  uid: any;
  modelAttendanceData: any = [];
  dataArray: any = [];
  modelattDatalength: number;
  modelShiftData: any = [];
  log1: any = [];
  modelRawData: any = [];
  allshift: any = [];
  formSelectedShift: any;
  clickedDate: any;
  finaldata: any = [];
  comId: any;
  manunalRows: any = [];
  ipAddress: any;
  corerectionData: any = [];
  verify: boolean = false;
  rows1: any[];
  show3: boolean;
  modalMessage = { show: false, modalMessage: '' };
  company_id: any;
  allbranch: any[];
  employee: any[];
  finalbranch: string;
  selectedMonth: any;
  UserID: any;
  logDate: any;
  UserMasterID: any;
  Date: any;
  TransID: any;
  showForm: boolean = false;
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: ''
  }
  alldepartment: any[];
  alldesignation: any[];
  allDivision: any[];
  allWorkingArea: any[];
  selectedbranch: null;
  selecteddept: null;
  selecteddesig: null;
  selectedDivision: null;
  selectedWorkingArea: null;
  logData: any = []
  temp_LogData: any = [];
  remarksValue: string = '';
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };

    this.company_id = localStorage.getItem('filterCompany')
      ? localStorage.getItem('filterCompany')
      : localStorage.getItem('company_id');
    this.UserID = localStorage.getItem('filterUser')
      ? +localStorage.getItem('filterUser')
      : +localStorage.getItem('id');
  }
  limit = 10;

  ngOnInit() {
    this.radiostatus = '2';
    this.remarksValue = ''
    this.dataArray = [];
    this.modelattDatalength = 0;
    this.modelShiftData = [];
    this.log1 = [];
    this.modelRawData = [];
    this.allshift = [];
    this.finaldata = [];
    this.manunalRows = [];
    this.corerectionData = [];
    this.verify = false;
    this.rows1 = [];
    this.logData = [];

    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    this.selectedMonth = year + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0');


    let startDate = new Date(year, Number(month), 2);
    let endDate = new Date(year, Number(month) + 1, 1);

    this.CalendarStartDate = startDate.toISOString().slice(0, 10);
    this.CalendarEndDate = endDate.toISOString().slice(0, 10);

    this.getCalenderData(this.CalendarStartDate, this.CalendarEndDate);

    this.checkpermission();
    this.getIPAddress();
    this.selectcompany(this.company_id);
  }

  getUsers() {

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.showForm = true;
          // this.selectAllForDropdownItems(this.employee);
        }
        this.spinner.stop('users');
      });
  }


  selectcompany(id: any) {

    this.alldepartment = []
    this.alldesignation = []
    this.allbranch = []
    this.allDivision = []
    this.allWorkingArea = []

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;

    if (!id) return;
    this.spinner.start('depart')
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          // this.filter = 'filt'

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('depart');
        }
      });

    // getDesignationData() {}
    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('desig');
        }
      });

    this.spinner.start('branch')

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('branch');
      });

    this.spinner.start('workingArea');
    this.api
      .callApi(this.constant.LISTWORKINGAREA + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('workingArea');
      });

    this.spinner.start('Division');
    this.api
      .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allDivision = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('Division');
      });

    this.users_Body.companyMasterID = id;
    this.getUsers();


    // this.finalbranch = '';
    // this.allbranch = [];
    // this.employee = [];

    // if (!id) {
    //   return;
    // }

    // if (id) {
    //   this.company_id = id;

    //   this.spinner.start('branch');
    //   this.api
    //     .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
    //     .subscribe((res: any) => {
    //       this.allbranch = res;
    //       this.spinner.stop('branch');
    //     });

    //   let bb = {
    //     page: '',
    //     limit: '',
    //     companyMasterID: id,
    //   };
    //   this.spinner.start('compcont');
    //   this.api
    //     .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
    //     .subscribe((res: any) => {
    //       if (res.status == 200) {
    //         this.employee = res.data;
    //         this.showForm = true;
    //       }
    //       this.spinner.stop('compcont');
    //     });
    // }
  }

  // selectbranch(event: any) {
  //   this.employee = [];
  //   this.UserID = null;
  //   this.rows = [];
  //   if (!event) {
  //     let bb = {
  //       page: '',
  //       limit: '',
  //       companyMasterID: this.company_id,
  //     };
  //     this.spinner.start('compcont');
  //     this.api
  //       .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.employee = res.data;
  //           this.showForm = true;
  //         }
  //         this.spinner.stop('compcont');
  //       });

  //     return;
  //   }

  //   const filterData = {
  //     companyMasterID: this.company_id,
  //     branchMasterID: event,
  //   };
  //   this.spinner.start('getalc');
  //   this.api
  //     .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.employee = res.data;
  //       }
  //       this.spinner.stop('getalc');
  //     });
  // }


  selectbranch(id) {
    this.employee = [];
    this.UserID = null;
    this.rows = [];
    this.users_Body.branchMasterID = id;
    this.getUsers();
  }

  selectdepart(id) {
    this.employee = [];
    this.UserID = null;
    this.rows = [];
    this.users_Body.departmentID = id;
    this.getUsers();
  }


  selectdesig(id) {
    this.employee = [];
    this.UserID = null;
    this.rows = [];
    this.users_Body.designationID = id;
    this.getUsers();
  }


  selectdivision(id) {
    this.employee = [];
    this.UserID = null;
    this.rows = [];
    this.users_Body.divisionId = id;
    this.getUsers();
  }

  selectWorkingArea(id) {
    this.employee = [];
    this.UserID = null;
    this.rows = [];
    this.users_Body.workingAreaId = id;
    this.getUsers();
  }



  getShift(event: any) {

    this.spinner.start();
    this.api
      .callApi(this.constant.SHIFTBYCOMPANYDATA2 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allshift = res.data;
          this.spinner.stop();
        }
      });
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
              permissionval.formName == 'DailyAttendance' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyAttendance' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyAttendance' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyAttendance' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getCalenderData(calendarStartDate: any, calendarEndDate: any) {
    let body = {
      userMasterID: localStorage.getItem('filterUser')
        ? localStorage.getItem('filterUser')
        : localStorage.getItem('id'),
      calendarstartdate: calendarStartDate,
      calendarenddate: calendarEndDate,
    };
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.rows = this.rows.filter((e) => !e.isShift);
          this.rows1 = this.rows;

          let data2 = {};
          let result = [];

          for (const entry of this.rows) {
            const date = entry.date;
            if (!data2[date]) {
              data2[date] = { ...entry };
            } else {
              data2[date].title += `, ${entry.title}`;
            }
          }

          for (const key in data2) {
            result.push(data2[key]);
          }

          this.rows = result;

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('data');
        }
      });
  }

  // selectShift(event) {
  //   // this.formSelectedShift = event;
  //   this.getManualInfo();
  // }

  getFormatDateTime(datetime) {
    var today = new Date(datetime);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    let h = (today.getHours() < 10 ? '0' : '') + today.getHours();
    let m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

    return yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m;

  }
  convertToDateTimeLocal(dateString: string): string {
    if (dateString != null) {
      const [datePart, timePart] = dateString.split(',');
      const [day, month, year] = datePart.split('/').map(x => parseInt(x.trim()));

      const dateObj = new Date(`${year}-${month}-${day} ${timePart.trim()}`);

      const formattedDateTime = dateObj.getFullYear() + '-' +
        String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
        String(dateObj.getDate()).padStart(2, '0') + 'T' +
        String(dateObj.getHours()).padStart(2, '0') + ':' +
        String(dateObj.getMinutes()).padStart(2, '0');

      return formattedDateTime;
    }
    else {
      return "";
    }
  }
  getManualInfo() {
    let body = {
      companyMasterID: Number(this.comId),
      date: this.clickedDate,
      userMasterID: [+this.UserID],
    };
    this.logData = [];
    // if (this.radiostatus == '2' && !shift) {
    //   body = {
    //     companyMasterID: Number(this.comId),
    //     branchMasterID: '',

    //     attendancetype: 2,
    //     date: this.clickedDate,
    //     shift: '',
    //     limit: '',
    //     page: '',
    //     userMasterID: [+this.UserID],
    //   };
    // }
    // if (this.radiostatus == '1' && shift) {
    //   body = {
    //     companyMasterID: Number(this.comId),
    //     branchMasterID: '',

    //     attendancetype: 1,
    //     date: this.clickedDate,
    //     shift: shift,
    //     limit: '',
    //     page: '',
    //     userMasterID: [+this.UserID],
    //   };
    // }

    this.spinner.start();
    this.api
      .callApi(this.constant.GETMANNUALATTENDANCEDATA_V2, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.manunalRows = res.data;

          for (var i = 0; i < this.manunalRows.length; i++) {
            this.verify = this.manunalRows[0].Attendance_Verify;

            if (this.manunalRows[i].punchInTime) {
              this.manunalRows[i].punchin = this.convertToDateTimeLocal(this.manunalRows[i].punchInTime);
            } else {
              this.manunalRows[i].punchin = '';
            }
            if (this.manunalRows[i].punchOutTime) {
              this.manunalRows[i].punchout = this.convertToDateTimeLocal(this.manunalRows[i].punchOutTime);
            } else {
              this.manunalRows[i].punchout = '';
            }

            if (this.manunalRows[i].attendanceLogs && this.manunalRows[i].attendanceLogs.length > 0) {

              this.manunalRows[i].attendanceLogs = this.sortLogsByDateTime(this.manunalRows[i].attendanceLogs);

              for (let j = 0; j < this.manunalRows[i].attendanceLogs.length; j++) {
                this.logData.push({
                  logId: this.manunalRows[i].attendanceLogs[j].attendanceLogID,
                  logDateTime: this.convertToDateTimeLocal(this.manunalRows[i].attendanceLogs[j].logDateTime),
                  direction: this.manunalRows[i].attendanceLogs[j].direction,
                  isEdited: false,
                  isdeleted: false,
                  // index: j + 1
                });
              }

            } else {

              this.logData.push({
                logId: null,
                logDateTime: null,
                direction: 'in',
                isEdited: false,
                isdeleted: false,
                // index: 0
              })
            }

            this.manunalRows[i].minpunchinvalid =
              this.manunalRows[i].attendance_date + 'T' + '01:00';
            this.manunalRows[i].maxpunchinvalid =
              this.manunalRows[i].attendance_date + 'T' + '12:59';

            var date1 = new Date(this.manunalRows[i].attendance_date);

            date1.setDate(date1.getDate() + 1);

            let final_date =
              date1.getFullYear() +
              '-' +
              String(date1.getMonth() + 1).padStart(2, '0') +
              '-' +
              String(date1.getDate()).padStart(2, '0');

            this.manunalRows[i].maxpunchinvalid1 = final_date + 'T' + '12:59';
          }




          // this.temp_LogData = this.logData;

        } else if (res.status == 400) {
          this.modalMessage.show = true;
          this.modalMessage.modalMessage = res.message;
        }
        this.spinner.stop();
      });
  }

  onEditClick(item: any) {
    this.logData = [];
    this.modalMessage.show = false;
    this.modalMessage.modalMessage = '';
    this.comId = item.companyMasterId;
    this.UserMasterID = item.userMasterId;
    this.Date = item.date
    this.remarksValue = '';
    this.getShift(this.comId);
    // this.getAttendanceCalculation(item.attendanceTransactionId);

    this.logDate = this.getLogDateTime(item.date);

    this.clickedDate = item.date;
    let shift = '';
    this.getManualInfo();

    // this.logData.push({
    //   logDateTime: null,
    //   direction: 'in',
    //   isEdited: false,
    //   isdeleted: false,
    // })
  }

  sortLogsByDateTime(logData) {
    const data = logData.sort((a, b) => {
      const dateA = new Date(a.logDateTime).getTime();
      const dateB = new Date(b.logDateTime).getTime();
      return dateA - dateB; // Ascending order
    });

    return data;
  }

  setInOutDirection(logData = []) {
    logData.forEach((item, index) => {
      item.direction = index % 2 === 0 ? 'in' : 'out';
    });

    return logData;
  }



  addLog(type: string, index: number) {

    const newLog = {
      logId: null,
      logDateTime: null,
      direction: '', // We'll set direction after adding
      isEdited: false,
      isDeleted: false,
      // index: index + 1 // Insert at the next index position
    };

    if (type === 'up') {
      // Add log at the beginning (up case)
      this.logData = [newLog, ...this.logData];
    } else {
      // Add log at the specified index (normal case)
      this.logData = [
        ...this.logData.slice(0, index + 1), // Logs before the new log
        newLog, // New log
        ...this.logData.slice(index + 1) // Logs after the new log
      ];
    }

    this.logData = this.logData.map(log => ({ ...log }));

    this.logData = this.setInOutDirection(this.logData); // Recalculate directions
  }

  removeLog(log) {
    log.isdeleted = true;
    this.logData = this.logData.filter(e => !e.isdeleted);
    this.logData = this.setInOutDirection(this.logData);


  }

  changeLog(log) {
    log.isEdited = true;
  }



  manual(maindata, type: any) {

    if (type == 'in') maindata.IN_Change = true;
    if (type == 'out') maindata.OUT_Change = true;

    if (this.radiostatus == '1') {
      if (maindata.attendanceType == '1') {
        maindata.punchin = 'fullday';
        maindata.punchout = 'fullday';
      } else if (maindata.attendanceType == '0.5') {
        maindata.punchin = 'halfday';
        maindata.punchout = 'halfday';
      } else if (maindata.attendanceType == '0') {
        maindata.punchin = '';
        maindata.punchout = '';
      }
    }


    const result = this.finaldata.filter(
      (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    );

    if (result.length > 0) {
      this.finaldata.splice(
        this.finaldata.findIndex(
          (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
        ),
        1,
      );

      if (maindata.punchin || maindata.punchout) this.finaldata.push(maindata);

      if (
        !maindata.punchin &&
        !maindata.punchout &&
        (maindata.punchInTime || maindata.punchOutTime)
      ) {
        this.finaldata.push(maindata);
      }

    } else {

      if (maindata.punchin || maindata.punchout || type) this.finaldata.push(maindata);

      if (maindata.attendanceType == '0' && this.radiostatus == '1') this.finaldata.push(maindata);


      if ((maindata.attendanceType == '1' || maindata.attendanceType == '0.5') && this.radiostatus == '1' && !maindata.punchin && !maindata.punchout) this.finaldata.push(maindata);

    }


    // const result = this.finaldata.filter(
    //   (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    // );

    // if (result.length > 0) {
    //   this.finaldata.splice(
    //     this.finaldata.findIndex(
    //       (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    //     ),
    //     1,
    //   );

    //   if (maindata.punchin || maindata.punchout) this.finaldata.push(maindata);

    //   if (
    //     !maindata.punchin &&
    //     !maindata.punchout &&
    //     (maindata.punchInTime || maindata.punchOutTime)
    //   ) {
    //     this.finaldata.push(maindata);
    //   }

    // } else {

    //   if (maindata.punchin || maindata.punchout) this.finaldata.push(maindata);

    //   if (maindata.attendanceType == '0' && this.radiostatus == '1') this.finaldata.push(maindata);


    //   if ((maindata.attendanceType == '1' || maindata.attendanceType == '0.5') && this.radiostatus == '1' && !maindata.punchin && !maindata.punchout) this.finaldata.push(maindata);

    // }


    // if (maindata.attendanceType == '1') {
    //   maindata.punchin = maindata.attendance_date + ' ' + maindata.ShiftIntime;
    //   if (
    //     new Date(maindata.attendance_date + ' ' + maindata.ShiftIntime) >
    //     new Date(maindata.attendance_date + ' ' + maindata.ShiftoutTime)
    //   ) {
    //     let outdate = new Date(maindata.attendance_date);

    //     outdate.setDate(outdate.getDate() + 1);

    //     let end_date =
    //       outdate.getFullYear() +
    //       '-' +
    //       String(outdate.getMonth() + 1).padStart(2, '0') +
    //       '-' +
    //       String(outdate.getDate()).padStart(2, '0');

    //     maindata.punchout = end_date + ' ' + maindata.ShiftoutTime;
    //   } else {
    //     maindata.punchout = maindata.attendance_date + ' ' + maindata.ShiftoutTime;
    //   }
    // } else if (maindata.attendanceType == '0.5') {
    //   maindata.punchin = maindata.attendance_date + ' ' + maindata.ShiftIntime;

    //   if (
    //     new Date(maindata.attendance_date + ' ' + maindata.ShiftIntime) >
    //     new Date(maindata.attendance_date + ' ' + maindata.halfday)
    //   ) {
    //     let outdate = new Date(maindata.attendance_date);

    //     outdate.setDate(outdate.getDate() + 1);

    //     let end_date =
    //       outdate.getFullYear() +
    //       '-' +
    //       String(outdate.getMonth() + 1).padStart(2, '0') +
    //       '-' +
    //       String(outdate.getDate()).padStart(2, '0');

    //     maindata.punchout = end_date + ' ' + maindata.halfday;
    //   } else {
    //     maindata.punchout = maindata.attendance_date + ' ' + maindata.halfday;
    //   }
    // } else if (maindata.attendanceType == '0') {
    //   maindata.punchin = '';
    //   maindata.punchout = '';
    // } else {
    // }

    // const result = this.finaldata.filter(
    //   (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    // );
    // if (result.length > 0) {
    //   this.finaldata.splice(
    //     this.finaldata.findIndex(
    //       (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
    //     ),
    //     1,
    //   );
    //   if (maindata.punchin != '' || maindata.punchout != '') {
    //     this.finaldata.push(maindata);
    //   }

    //   if (
    //     maindata.punchin == '' &&
    //     maindata.punchout == '' &&
    //     (maindata.punchInTime != '' || maindata.punchOutTime != '')
    //   ) {
    //     this.finaldata.push(maindata);
    //   }
    // } else {
    //   if (maindata.punchin != '' || maindata.punchout != '') {
    //     this.finaldata.push(maindata);
    //   }
    //   // if (maindata.punchin == '' && maindata.punchout == '') {
    //   //   this.finaldata.push(maindata)

    //   // }
    //   if (maindata.attendanceType == '0') {
    //     this.finaldata.push(maindata);
    //   }
    // }

    // for (var i = 0; i < this.finaldata.length; i++) {
    //   this.finaldata[i].createBy = localStorage.getItem('id');
    //   this.finaldata[i].updateBy = localStorage.getItem('id');
    //   this.finaldata[i].createByIp = this.ipAddress;
    // }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  isLogASCOrder(logs = []) {
    for (let i = 0; i < logs.length - 1; i++) {
      const currentDateTime = new Date(logs[i].logDateTime);
      const nextDateTime = new Date(logs[i + 1].logDateTime);

      if (currentDateTime > nextDateTime) {
        return false; // Found an out-of-order pair
      }
    }
    return true; // All pairs are in order
  }


  extractDateTime(dateTimeStr) {
    return {
      date: dateTimeStr.slice(0, 10),
      time: dateTimeStr.slice(11, 19),
    };
  }

  combineDateTime({ date, time }) {
    return `${date} ${time}`;
  }

  onSubmitAttendaceForm() {
    if (this.radiostatus == '1' || this.radiostatus == '3') {
      if (!this.addcomp.valid) {
        return;
      }
    }


    // Add Multiple Logs
    if (this.radiostatus == 3) {
      if (!this.isLogASCOrder(this.logData)) {
        return this.notifications.create(
          'Error',
          'Please ensure all logs are in the correct chronological order.',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }

      this.finaldata = [];

      for (let i = 0; i < this.manunalRows.length; i++) {
        this.manunalRows[i].attendanceLogData = this.logData;
        this.finaldata.push(this.manunalRows[i]);
      }

    }

    // Add IN OUT Time
    if (this.radiostatus == '2') {

      const userName = [];

      for (let i = 0; i < this.finaldata.length; i++) {
        let data = this.finaldata[i];

        if (data.punchin && data.punchout) {
          let final_in = this.combineDateTime(this.extractDateTime(data.punchin));
          let final_out = this.combineDateTime(this.extractDateTime(data.punchout));

          if (new Date(final_in) > new Date(final_out)) {
            userName.push(data.Name);
          }
        } else if (!data.punchin && data.punchout) {
          userName.push(data.Name);

        } else if (data.punchin && !data.punchout && data.punchOutTime) {
          let final_in = this.combineDateTime(this.extractDateTime(data.punchin));

          if (new Date(final_in) > new Date(data.punchOutTime)) {
            userName.push(data.Name);
          }
        }
      }

      if (userName.length > 0) {
        return this.notifications.create(
          'Error',
          'user' + ' ' + userName.join(', ') + ' ' + 'punchout must be greater than punchin',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
    }

    // add remarks

    this.finaldata.forEach(e => {
      e.remarks = this.remarksValue;
    });

    const body = {
      attendanceType: this.radiostatus,
      finaldataarray: this.finaldata,
      companyMasterID: this.comId,
    };


    this.spinner.start('start');
    this.api
      .callApi(this.constant.ADDMANUALATTENDANCE_V2, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('start');
            this.closeModal.nativeElement.click();
          }, 3000);
        } else {
          this.modalMessage.show = true;
          this.modalMessage.modalMessage = res.message;
          this.spinner.stop('start');
        }
      }, (err) => {
        this.spinner.stop('start');
      });

    // }
  }

  onRowClick(item: any) {
    this.attendanceData(item.date);
    this.employeeShift(item.shift);
    // this.getAttendanceCalculation(item.attendanceTransactionId);
    this.getRawData(item.date);
  }

  onSubmit() {
    if (!this.filterdate.valid) {
      this.rows = [];
      return;
    }
    this.radiostatus = '2';
    this.dataArray = [];
    this.modelattDatalength = 0;
    this.modelShiftData = [];
    this.log1 = [];
    this.modelRawData = [];
    this.allshift = [];
    this.finaldata = [];
    this.manunalRows = [];
    this.corerectionData = [];
    this.verify = false;
    this.rows1 = [];

    localStorage.setItem('filterUser', this.filterdate.value.user);

    // let currentDate = new Date();
    // let year = currentDate.getFullYear();
    let month = this.filterdate.value.YearMM;

    let startDate = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 2);
    let endDate = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1);

    let CalendarStartDate = startDate.toISOString().slice(0, 10);
    let CalendarEndDate = endDate.toISOString().slice(0, 10);

    this.filter = 'filter';

    this.getCalenderData(CalendarStartDate, CalendarEndDate);
  }

  attendanceData(date) {
    let body = {
      userMasterID: this.UserID,
      calendarstartdate: date,
      calendarenddate: date,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.modelattDatalength = Object.keys(res.data).length;
          this.modelAttendanceData = res.data[0];
          this.spinner.stop();
        }
      });
  }

  employeeShift(shift: any) {
    if (!shift) return;

    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWSHIFT + shift, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.modelShiftData = res.data;
          this.spinner.stop();
        }
      });
  }

  // getAttendanceCalculation(attendanceTransactionId) {
  //   this.log1 = [];
  //   if (attendanceTransactionId) {
  //     this.spinner.start();
  //     this.api
  //       .callApi(
  //         this.constant.GETATTENDANCELOGBYTRANSID + Number(attendanceTransactionId),
  //         {},
  //         'GET',
  //         true,
  //         false,
  //         true,
  //       )
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.log1 = res.data;
  //           this.spinner.stop();
  //         }
  //       });
  //   }
  // }

  getRawData(date) {
    const givenDate = new Date(date);

    const beforeDate = new Date(givenDate);
    beforeDate.setDate(givenDate.getDate() - 1);

    const afterDate = new Date(givenDate);
    afterDate.setDate(givenDate.getDate() + 1);

    const beforeDateStr = beforeDate.toISOString().slice(0, 10);
    const afterDateStr = afterDate.toISOString().slice(0, 10);

    let body = {
      userMasterID: this.UserID,
      calendarstartdate: beforeDateStr,
      calendarenddate: afterDateStr,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.modelattDatalength = Object.keys(res.data).length;
          this.modelRawData = res.data;
          this.spinner.stop();
        }
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'main') {
      this.filterData.page = e.offset + 1;
      this.ngOnInit();
    } else if (this.filter == 'filter') {
      this.body1.page = e.offset + 1;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'main') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.ngOnInit();
    } else if (this.filter == 'filter') {
      this.body1.limit = ev;
      this.limit = this.body1.limit;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.filterdate.resetForm();
    this.selectcompany(this.company_id);
  }

  selectfrom() {
    this.enddate = new Date();
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(inputDate) {
    const dateObj = new Date(inputDate);
    dateObj.setUTCHours(dateObj.getUTCHours() + 5);
    dateObj.setUTCMinutes(dateObj.getUTCMinutes() + 30);

    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  download() {
    let data = [];

    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let CalendarStartDate = '';
    let CalendarEndDate = '';

    if (this.filterdate.value.YearMM) {
      let month = this.filterdate.value.YearMM;

      let startDate = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 2);
      let endDate = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1);

      CalendarStartDate = startDate.toISOString().slice(0, 10);
      CalendarEndDate = endDate.toISOString().slice(0, 10);
    } else {
      let currentDate = new Date();
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth();

      let startDate = new Date(year, Number(month), 2);
      let endDate = new Date(year, Number(month) + 1, 0);

      CalendarStartDate = startDate.toISOString().slice(0, 10);
      CalendarEndDate = endDate.toISOString().slice(0, 10);
    }

    let filterData = {
      calendarstartdate: CalendarStartDate,
      calendarenddate: CalendarEndDate,
      userMasterID: this.UserID,
      exportData: 'true'
    };
    this.spinner.start('a')
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, filterData, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.notifications.create('No data found to export!', '', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('a');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Attendance.xlsx`);

          this.spinner.stop('a');
        }
      });
  }

  onCorerectionData(item) {
    if (item.userMasterId && item.date) {
      this.spinner.start();
      this.api
        .callApi(
          this.constant.GETALLATTENDACECORRECTION +
          '?' +
          'userMasterID=' +
          Number(item.userMasterId) +
          '&date=' +
          item.date,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.corerectionData = res.data;
            this.spinner.stop();
          }
        });
    }
  }


  getLogDateTime(parameterDate) {
    let today = parameterDate ? new Date(parameterDate) : new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let h = (today.getHours() < 10 ? '0' : '') + today.getHours();
    let m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

    let addDate = new Date(yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m);
    addDate.setDate(addDate.getDate() + 1);

    return {
      date: yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m,
      minpunchinvalid: addDate.getFullYear() + '-' + String(addDate.getMonth() + 1).padStart(2, '0') + '-' + String(addDate.getDate()).padStart(2, '0') + 'T' + h + ':' + m,
      maxpunchinvalid: yyyy + '-' + mm + '-' + dd
    };
  }

  closemodal() {
    if (this.filterdate.value.YearMM) {
      this.onSubmit();
    } else {
      this.ngOnInit();
    }

    this.modalMessage.show = false;
    this.modalMessage.modalMessage = '';
  }

  checkColor(item: any, late: any, early: any) {
    if (item == 'WeekOff') {
      return 'weekly-off';
    } else if (item == 'Holiday') {
      return 'holiday';
    } else if (item == 'Present') {
      return 'present';
    } else if (item == 'Absent') {
      return 'absent';
    } else if (item == 'Half Day') {
      return 'halfDay';
    } else if (item == 'WeekOff') {
      return 'weekly-off';
    } else if (item == 'Leave') {
      return 'leave';
    } else if (item == 'PL') {
      return 'leave';
    } else if (item == 'Optional Holiday') {
      return 'holiday';
    } else if (item.includes('Present')) {
      if (late || early) return 'penaltywithdeduction';
      if (item.includes('LC') || item.includes('EG')) return 'penaltywithoutdeduction';

      return 'present';
    } else if (item.includes('Absent')) {
      return 'absent';
    } else if (item.includes('Half Day')) {
      return 'halfDay';
    }
    else if (item.includes('Miss Punch')) {
      return 'missing-punch';
    }
    else {
      return 'leave';
    }
  }
}
