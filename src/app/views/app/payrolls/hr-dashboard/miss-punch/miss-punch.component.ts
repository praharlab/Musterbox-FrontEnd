import { environment } from 'src/environments/environment';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-miss-punch',
    templateUrl: './miss-punch.component.html',
    styleUrls: ['./miss-punch.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MissPunchComponent implements OnInit {
  @ViewChild('dateFilter') dateFilter: NgForm;

  apiURL = environment.apiUrl;
  scrollBarHorizontal: boolean;
  companyMasterID: string;
  missPunchDataDate: string;
  showloader: any = 'true';
  missPunchData: any = [];
  currentDate: string;
  fromDate: string;
  toDate: string;
  branch: any;
  maxDate: string;
  allbranch: any
  branchMasterID: any = []

  @ViewChild('tabset') tabset: TabsetComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;

  @ViewChild('addcomp') addcomp: NgForm;
  missPunchUserMasterId: any;

  calendarData: any = [];
  CalendarStartDate: any;
  CalendarEndDate: any;
  startDate1: any;
  startMonth1: any;
  startYear1: any;
  endDate1: any;
  endMonth1: any;
  endYear1: any;
  rows: any;
  modelAttendanceData: any = [];
  dataArray: any = [];
  modelattDatalength: number;
  modelShiftData: any = [];
  log: any = [];
  modelRawData: any = [];
  month: number;
  year: number;
  userAttendanceSummaryData: any = [];

  radiostatus: any = '2';
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
  allshift: any = [];
  filter: any;
  manualcompanyMasterId: any;
  permissionview: any = [];
  modalMessage = { show: false, modalMessage: '' };
  permissionedit: any = [];
  clickedUsername: any;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.companyMasterID = localStorage.getItem('company_id');
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.fromDate = this.currentDate
    this.toDate = this.currentDate
    this.maxDate = new Date().toISOString().slice(0, 10);

    this.getMissPunchData();

    this.radiostatus = '2';
    this.dataArray = [];
    this.modelattDatalength = 0;
    this.modelShiftData = [];
    this.modelRawData = [];
    this.allshift = [];
    this.finaldata = [];
    this.manunalRows = [];
    this.corerectionData = [];
    this.verify = false;
    this.rows1 = [];

    this.getIPAddress();
    this.checkpermission();
    this.getAllBranches();
  }

  onDateSelect(form) {
    this.branchMasterID = form?.value?.branch
    if (!this.dateFilter.valid) {
      return;
    }
    this.fromDate = form?.value?.fromDate
    this.toDate = form?.value?.toDate
    this.getMissPunchData();
  }

  getMissPunchData() {
    if (this.fromDate == '' || this.toDate == '') return;
    this.showloader = 'true';
    let queryString = `?companyMasterID=${this.companyMasterID}&fromDate=${this.fromDate}&toDate=${this.toDate}&branchID=${this.branchMasterID}`;
    const body = {
      companyMasterID: this.companyMasterID,
      fromDate: this.fromDate,
      toDate: this.toDate,
      branchID: this.branchMasterID,
    };
    this.api
      .callApi(this.constant.DASHBOARDMISSPUNCHREPORT, body, 'POST', false, false, true)
      .subscribe(
        (res: any) => {
          this.missPunchData = res.data;
          this.showloader = 'false';
        },
        (err) => {
          console.log(err, 'ERROR');
        },
      );
  }

  checkpermission() {
    this.showloader = 'true';
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
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

          this.showloader = 'false';
        }
      });
  }

  attendanceData(date) {
    let body = {
      userMasterID: this.missPunchUserMasterId,
      calendarstartdate: date,
      calendarenddate: date,
    };
    this.showloader = 'true';
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.modelattDatalength = Object.keys(res.data).length;
          this.modelAttendanceData = res.data[0];
          this.showloader = 'false';
        }
      });
  }

  employeeShift() {
    this.showloader = 'true';
    let userid = this.missPunchUserMasterId;
    this.api
      .callApi(this.constant.GETEMPLOYEESHIFT + userid, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.modelShiftData = res.data;
          this.showloader = 'false';
        }
      });
  }

  getAttendanceCalculation(attendanceTransactionId) {
    if (attendanceTransactionId) {
      try {
        this.showloader = 'true';
        this.api
          .callApi(
            this.constant.GETATTENDANCELOGBYTRANSID + Number(attendanceTransactionId),
            {},
            'GET',
            false,
            false,
            true,
          )
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.log = res.data;
              this.showloader = 'false';
            }
          });
      } catch (e) {
      }
    }
  }

  getRawData(date) {
    const givenDate = new Date(date);

    const beforeDate = new Date(givenDate);
    beforeDate.setDate(givenDate.getDate() - 1);

    const afterDate = new Date(givenDate);
    afterDate.setDate(givenDate.getDate() + 1);

    const beforeDateStr = beforeDate.toISOString().slice(0, 10);
    const afterDateStr = afterDate.toISOString().slice(0, 10);

    let body = {
      userMasterID: this.missPunchUserMasterId,
      calendarstartdate: beforeDateStr,
      calendarenddate: afterDateStr,
    };
    this.showloader = 'true';
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.modelattDatalength = Object.keys(res.data).length;
          this.modelRawData = res.data;
          this.showloader = 'false';
        }
      });
  }

  closeModal1() {
    this.radiostatus = '2';
    this.dataArray = [];
    this.modelattDatalength = 0;
    this.modelShiftData = [];
    this.modelRawData = [];
    this.allshift = [];
    this.finaldata = [];
    this.manunalRows = [];
    this.corerectionData = [];
    this.verify = false;
    this.rows1 = [];

    this.getMissPunchData();
  }

  manual(maindata) {
    if (maindata.attendanceType == '1') {
      maindata.punchin = maindata.attendance_date + ' ' + maindata.ShiftIntime;
      if (maindata.ShiftIntime > maindata.ShiftoutTime) {
        let outdate = new Date(maindata.attendance_date);

        outdate.setDate(outdate.getDate() + 1);

        let end_date =
          outdate.getFullYear() +
          '-' +
          String(outdate.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(outdate.getDate()).padStart(2, '0');

        maindata.punchout = end_date + ' ' + maindata.ShiftoutTime;
      } else {
        maindata.punchout = maindata.attendance_date + ' ' + maindata.ShiftoutTime;
      }
    } else if (maindata.attendanceType == '0.5') {
      maindata.punchin = maindata.attendance_date + ' ' + maindata.ShiftIntime;

      if (maindata.ShiftIntime > maindata.halfday) {
        let outdate = new Date(maindata.attendance_date);

        outdate.setDate(outdate.getDate() + 1);

        let end_date =
          outdate.getFullYear() +
          '-' +
          String(outdate.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(outdate.getDate()).padStart(2, '0');

        maindata.punchout = end_date + ' ' + maindata.halfday;
      } else {
        maindata.punchout = maindata.attendance_date + ' ' + maindata.halfday;
      }
    } else if (maindata.attendanceType == '0') {
      maindata.punchin = '';
      maindata.punchout = '';
    } else {
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
      if (maindata.punchin != '' || maindata.punchout != '') {
        this.finaldata.push(maindata);
      }

      if (
        maindata.punchin == '' &&
        maindata.punchout == '' &&
        (maindata.punchInTime != '' || maindata.punchOutTime != '')
      ) {
        this.finaldata.push(maindata);
      }
    } else {
      if (maindata.punchin != '' || maindata.punchout != '') {
        this.finaldata.push(maindata);
      }
      // if (maindata.punchin == '' && maindata.punchout == '') {
      //   this.finaldata.push(maindata)

      // }
      if (maindata.attendanceType == '0') {
        this.finaldata.push(maindata);
      }
    }

    for (var i = 0; i < this.finaldata.length; i++) {
      this.finaldata[i].createBy = localStorage.getItem('id');
      this.finaldata[i].updateBy = localStorage.getItem('id');
      this.finaldata[i].createByIp = this.ipAddress;
    }
  }

  onSubmitAttendaceForm() {
    if (this.radiostatus == '1') {
      if (this.addcomp.value.attendanceType == '' || !this.addcomp.value.attendanceType) {
        return;
      }

      if (this.addcomp.value.shiftID == '' || !this.addcomp.value.shiftID) {
        return;
      }

      if (this.addcomp.value.Comment == '' || !this.addcomp.value.Comment) {
        return;
      }
    }
    let userName = [];
    for (var i = 0; i < this.finaldata.length; i++) {
      if (this.finaldata[i].punchin != '' && this.finaldata[i].punchout != '') {
        let punchindate = this.finaldata[i].punchin.slice(0, 10);

        let punchintime = this.finaldata[i].punchin.slice(11, 19);

        let final_in = punchindate + ' ' + punchintime;

        let punchoutdate = this.finaldata[i].punchout.slice(0, 10);

        let punchouttime = this.finaldata[i].punchout.slice(11, 19);

        let final_out = punchoutdate + ' ' + punchouttime;

        if (new Date(final_in) <= new Date(final_out)) {
        } else {
          userName.push(this.finaldata[i].Name);
        }
      } else if (this.finaldata[i].punchin == '' && this.finaldata[i].punchout != '') {
        let punchoutdate = this.finaldata[i].punchout.slice(0, 10);

        let punchouttime = this.finaldata[i].punchout.slice(11, 19);

        let final_out = punchoutdate + ' ' + punchouttime;

        if (new Date(this.finaldata[i].punchInTime) <= new Date(final_out)) {
        } else {
          userName.push(this.finaldata[i].Name);
        }
      } else if (this.finaldata[i].punchin != '' && this.finaldata[i].punchout == '') {
        let punchindate = this.finaldata[i].punchin.slice(0, 10);

        let punchintime = this.finaldata[i].punchin.slice(11, 19);

        let final_in = punchindate + ' ' + punchintime;

        if (this.finaldata[i].punchOutTime != '' && this.finaldata[i].punchOutTime != null) {
          if (new Date(final_in) <= new Date(this.finaldata[i].punchOutTime)) {
          } else {
            userName.push(this.finaldata[i].Name);
          }
        }
      } else {
      }
    }
    if (userName.length > 0) {
      this.notifications.create(
        'Error',
        'user' + ' ' + userName + ' ' + 'punchout must be greater than punchin',
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
    } else {
      const body = {
        attendanceType: this.radiostatus,
        finaldataarray: this.finaldata,
        companyMasterID: this.manualcompanyMasterId,
      };

      this.showloader = 'true';
      this.api
        .callApi(this.constant.ADDMANUALATTENDANCE_V2, body, 'POST', false, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.showloader = 'false';
              this.closeModal.nativeElement.click();
            }, 3000);
          } else {
            this.modalMessage.show = true;
            this.modalMessage.modalMessage = res.message;
            this.showloader = 'false';
          }
        });
    }
  }

  getShift(event) {
    let filterData = {
      page: '',
      limit: '',
      companyMasterID: event,
    };

    this.showloader = 'true';
    this.api
      .callApi(this.constant.GETSHIFTDATA, filterData, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allshift = res.data;
          this.showloader = 'false';
        }
      });
  }
  selectShift(event) {
    this.formSelectedShift = event;

    this.getManualInfo(this.formSelectedShift);
  }

  getManualInfo(shift) {
    let body = {};
    if (this.radiostatus == '2' && !shift) {
      body = {
        companyMasterID: Number(this.manualcompanyMasterId),
        branchMasterID: '',

        attendancetype: 2,
        date: this.clickedDate,
        shift: '',
        limit: '',
        page: '',
        userMasterID: [Number(this.missPunchUserMasterId)],
      };
    }
    if (this.radiostatus == '1' && shift) {
      body = {
        companyMasterID: Number(this.manualcompanyMasterId),
        branchMasterID: '',

        attendancetype: 1,
        date: this.clickedDate,
        shift: shift,
        limit: '',
        page: '',
        userMasterID: [Number(this.missPunchUserMasterId)],
      };
    }

    this.showloader = 'true';
    this.api
      .callApi(this.constant.GETMANNUALATTENDANCEDATA, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.manunalRows = res.data;

          for (var i = 0; i < this.manunalRows.length; i++) {
            this.verify = this.manunalRows[0].Attendance_Verify;
            if (this.manunalRows[i].punchInTime != null && this.manunalRows[i].punchInTime != '') {
              var today = new Date(this.manunalRows[i].punchInTime);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0');
              var yyyy = today.getFullYear();
              let h = (today.getHours() < 10 ? '0' : '') + today.getHours();
              let m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

              let date = yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m;

              // let myTime = new Date(this.manunalRows[i].punchInTime).toLocaleTimeString('en-US');

              // let punchin = date + 'T' + myTime;

              this.manunalRows[i].punchin = date;

              // this.manunalRows[i].punchin =new Date(this.manunalRows[i].punchInTime).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
            } else {
              this.manunalRows[i].punchin = '';
            }
            if (
              this.manunalRows[i].punchOutTime != null &&
              this.manunalRows[i].punchOutTime != ''
            ) {
              var today = new Date(this.manunalRows[i].punchOutTime);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0');
              var yyyy = today.getFullYear();
              let h = (today.getHours() < 10 ? '0' : '') + today.getHours();
              let m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

              let date = yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m;

              this.manunalRows[i].punchout = date;
            } else {
              this.manunalRows[i].punchout = '';
            }
            if (this.manunalRows[i].present == '1') {
              this.manunalRows[i].attendanceType = 'P';
            } else if (this.manunalRows[i].present == '0.5') {
              this.manunalRows[i].attendanceType = 'HD';
            } else if (this.manunalRows[i].present == '0') {
              this.manunalRows[i].attendanceType = 'A';
            } else {
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
        } else if (res.status == 400) {
          this.modalMessage.show = true;
          this.modalMessage.modalMessage = res.message;
        }
        this.showloader = 'false';
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onCorerectionData(userMasterId, date) {
    if (userMasterId && date) {
      this.showloader = 'true';
      this.api
        .callApi(
          this.constant.GETALLATTENDACECORRECTION +
          '?' +
          'userMasterID=' +
          Number(userMasterId) +
          '&date=' +
          date,
          {},
          'GET',
          false,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.corerectionData = res.data;
            this.showloader = 'false';
          }
        });
    }
  }

  setUsermasterId(data) {
    this.missPunchUserMasterId = data.userMasterID;
    this.manualcompanyMasterId = data.userMaster.companyMasterId;
    this.modalMessage.show = false;
    this.modalMessage.modalMessage = '';
    this.clickedUsername = data.userMaster.displayName;
    this.attendanceData(data.AttendanceDate);
    this.employeeShift();
    this.getAttendanceCalculation(data.AttendanceTransID);
    this.getRawData(data.AttendanceDate);
    this.onCorerectionData(data.userMasterID, data.AttendanceDate);
    this.getShift(Number(this.manualcompanyMasterId));

    this.clickedDate = data.AttendanceDate;
    let shift = '';
    this.getManualInfo(shift);
  }

  getAllBranches() {
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + this.companyMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    allSelect(items);
  }
}
