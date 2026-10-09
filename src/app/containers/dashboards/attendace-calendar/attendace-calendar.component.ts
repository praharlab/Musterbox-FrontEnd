import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { Colors } from 'src/app/constants/colors.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-attendace-calendar',
    templateUrl: './attendace-calendar.component.html',
    styleUrls: ['./attendace-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AttendaceCalendarComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  @ViewChild('filterdate') filterdate: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;

  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent;
  @ViewChild('addcomp') addcomp: NgForm;

  @Input() id: any;
  @Input() companyId: any;

  calendarVisible = true;
  showloader: any = false;

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, bootstrapPlugin],

    headerToolbar: {
      left: 'today',
      center: 'title',
      right: 'prev,next',
    },
    themeSystem: 'bootstrap',
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 1,
    eventOverlap: false,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: this.eventsfunction.bind(this),
    dateClick: this.handleDateSelect.bind(this),

    customButtons: {
      today: {
        text: 'Today',
        click: () => {
          this.goToToday();
        },
      },
      prev: {
        text: 'Prev',
        click: () => {
          this.goToPrev();
        },
      },
      next: {
        text: 'Next',
        click: () => {
          this.goToNext();
        },
      },
    },
  };

  currentEvents: any[];
  events: any | [];
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
  uid: any;
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
  DailyAttendance;
  permissionview: any = [];
  modalMessage = { show: false, modalMessage: '' };
  permissionedit: any = [];

  formValue: any;
  logData: any = [];
  remarksValue: any;


  constructor(
    private changeDetector: ChangeDetectorRef,
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit() {


    this.comId = this.companyId;

    this.formValue = this.formValueStorageService.getData();


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

    this.eventsfunction();
    this.alldata();
    this.getIPAddress();
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

          this.spinner.stop();
        }
      });
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  goToToday() {
    const calendarApi = this.fullCalendar.getApi(); // Get FullCalendar API instance
    calendarApi.today(); // Call the next() method to go to the next view
    const view = calendarApi.view; // Get the current view
    const start = view.currentStart; // Get the start date of the view
    const end = view.currentEnd; // Get the end date of the view

    let currentDate = new Date(start);

    this.startMonth1 = currentDate.getMonth() + 1;
    this.startYear1 = currentDate.getFullYear();

    let nextMonthStartDate = new Date(currentDate);
    nextMonthStartDate.setMonth(currentDate.getMonth(), 2);
    nextMonthStartDate.setHours(0, 0, 0, 0);

    let nextMonthEndDate = new Date(currentDate);
    nextMonthEndDate.setMonth(currentDate.getMonth() + 1, 0);
    nextMonthEndDate.setHours(23, 59, 59, 999);

    this.CalendarStartDate = nextMonthStartDate.toISOString().slice(0, 10);
    this.CalendarEndDate = nextMonthEndDate.toISOString().slice(0, 10);

    this.getCalenderData(this.uid, this.CalendarStartDate, this.CalendarEndDate);

    this.userAttendanceSummary(this.uid, this.CalendarStartDate, this.CalendarEndDate);
  }

  goToNext() {
    const calendarApi = this.fullCalendar.getApi(); // Get FullCalendar API instance
    calendarApi.next(); // Call the next() method to go to the next view
    const view = calendarApi.view; // Get the current view
    const start = view.currentStart; // Get the start date of the view
    const end = view.currentEnd; // Get the end date of the view

    // Parse the given date
    let currentDate = new Date(start);

    this.startMonth1 = currentDate.getMonth() + 1;
    this.startYear1 = currentDate.getFullYear();

    // Calculate the start date of the next month
    let nextMonthStartDate = new Date(currentDate);
    nextMonthStartDate.setMonth(currentDate.getMonth(), 2);
    nextMonthStartDate.setHours(0, 0, 0, 0);

    // Calculate the end date of the next month
    let nextMonthEndDate = new Date(currentDate);
    nextMonthEndDate.setMonth(currentDate.getMonth() + 1, 0);
    nextMonthEndDate.setHours(23, 59, 59, 999);

    // Convert the start and end dates to the desired format
    this.CalendarStartDate = nextMonthStartDate.toISOString().slice(0, 10);
    this.CalendarEndDate = nextMonthEndDate.toISOString().slice(0, 10);

    this.getCalenderData(this.uid, this.CalendarStartDate, this.CalendarEndDate);

    this.userAttendanceSummary(this.uid, this.CalendarStartDate, this.CalendarEndDate);
  }

  goToPrev() {
    const calendarApi = this.fullCalendar.getApi(); // Get FullCalendar API instance
    calendarApi.prev(); // Call the prev() method to go to the previous view
    const view = calendarApi.view; // Get the current view
    const start = view.currentStart; // Get the start date of the view
    const end = view.currentEnd; // Get the end date of the view

    let currentDate = new Date(start);

    this.startMonth1 = currentDate.getMonth() + 1;
    this.startYear1 = currentDate.getFullYear();

    // Calculate the start date of the next month
    let nextMonthStartDate = new Date(currentDate);
    nextMonthStartDate.setMonth(currentDate.getMonth(), 2);
    nextMonthStartDate.setHours(0, 0, 0, 0);

    // Calculate the end date of the next month
    let nextMonthEndDate = new Date(currentDate);
    nextMonthEndDate.setMonth(currentDate.getMonth() + 1, 0);
    nextMonthEndDate.setHours(23, 59, 59, 999);

    // Convert the start and end dates to the desired format
    this.CalendarStartDate = nextMonthStartDate.toISOString().slice(0, 10);
    this.CalendarEndDate = nextMonthEndDate.toISOString().slice(0, 10);

    this.getCalenderData(this.uid, this.CalendarStartDate, this.CalendarEndDate);

    this.userAttendanceSummary(this.uid, this.CalendarStartDate, this.CalendarEndDate);
  }

  handleDateSelect(selectInfo) { }

  handleEventClick(clickInfo) {
    const startDate1 = this.CalendarStartDate;
    const endDate1 = this.CalendarEndDate;
    const event = clickInfo.event;
    const startDate = event.start;
    const dateObject = new Date(startDate);
    this.log = [];

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    const convertedDate = `${year}-${month}-${day}`;
    this.remarksValue = ''

    if (convertedDate >= startDate1 && convertedDate <= endDate1) {
      this.modalMessage.show = false;
      this.modalMessage.modalMessage = '';

      this.lgModal.show();
      this.attendanceData(convertedDate);
      this.employeeShift();
      this.getAttendanceCalculation(clickInfo.event.extendedProps.attendanceTransactionId);
      this.getRawData(convertedDate);
      this.onCorerectionData(clickInfo.event.extendedProps.userMasterId, convertedDate);

      this.lgModal.show();
      this.getShift(Number(this.manualcompanyMasterId));

      this.clickedDate = convertedDate;
      let shift = '';
      this.getManualInfo();
    } else {
      if (convertedDate <= startDate1) {
        this.notifications.create(
          'Error',
          'Go to That Month Using Calendar. ',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      } else {
        this.notifications.create(
          'Error',
          'You can not add attendance in future date.',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
    }
  }

  eventsfunction() {
    this.remarksValue = ''
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    this.year = year;
    this.month = month;

    let startDate = new Date(year, Number(month), 2);
    let endDate = new Date(year, Number(month) + 1, 1);

    let startDateFormatted = startDate.toISOString().slice(0, 10);
    let endDateFormatted = endDate.toISOString().slice(0, 10);

    this.CalendarStartDate = startDateFormatted;
    this.CalendarEndDate = endDateFormatted;

    let userid = this.id ? this.id : this.formValue.EmployeeAttendanceListComponent.id;

    this.getCalenderData(userid, this.CalendarStartDate, this.CalendarEndDate);

    this.userAttendanceSummary(userid, this.CalendarStartDate, this.CalendarEndDate);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  onSubmit() {
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
    this.uid = this.id;



    // let formId = this.filterdate.value.userMasterID;
    // let formId = this.id

    if (this.id) {
      this.getCalenderData(this.id, this.CalendarStartDate, this.CalendarEndDate);

      this.userAttendanceSummary(this.id, this.CalendarStartDate, this.CalendarEndDate);
    }


  }

  userAttendanceSummary(userid, startdate, enddate) {

    let userMasterID = userid ? userid : this.formValue.EmployeeAttendanceListComponent.id;
    this.spinner.start('start2');
    this.api
      .callApi(
        this.constant.USERATTENDANCESUMMARY +
        '?' +
        'userMasterID=' +
        userMasterID +
        '&startdate=' +
        startdate +
        '&enddate=' +
        enddate,
        {},
        'GET',
        false,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userAttendanceSummaryData = res.data;
        }

        this.spinner.stop('start2');
      }, (err) => {
        this.spinner.stop('start2');
      });
  }

  getCalenderData(id: any, calendarStartDate: any, calendarEndDate: any) {
    this.uid = id;
    let body = {
      userMasterID: id ? id : this.formValue.EmployeeAttendanceListComponent.id,
      calendarstartdate: calendarStartDate,
      calendarenddate: calendarEndDate,
    };
    this.spinner.start('start1');
    this.api
      .callApi(this.constant.GETDATACALENDERMONTHWISE, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.calendarData = res.data;



          if (this.calendarData.length > 0) {
            this.manualcompanyMasterId = this.calendarData[0].companyMasterId
              ? this.calendarData[0].companyMasterId
              : localStorage.getItem('company_id');
          } else {
            this.manualcompanyMasterId = '';
          }

          for (let i = 0; i < this.calendarData.length; i++) {
            this.calendarData[i]['classNames'] =
              'w-sm-100 w-md-100 w-80 m-auto icon d-flex justify-content-center  justify-content-lg-around justify-content-xl-around   text-white align-items-center   font-weight-bold  lh-1 text-wrap text-center';

            if (this.calendarData[i].title === 'Absent') {
              this.calendarData[i]['color'] = Colors.getColors().Absent;
              this.calendarData[i]['priority'] = 1;
            } else if (this.calendarData[i].title === 'WeekOff') {
              this.calendarData[i]['color'] = Colors.getColors().weekoff;
              this.calendarData[i]['priority'] = 2;
            } else if (this.calendarData[i].title === 'Half Day') {
              this.calendarData[i]['color'] = Colors.getColors().HalfDay;
              this.calendarData[i]['priority'] = 1;
            } else if (this.calendarData[i].title === 'Present') {
              this.calendarData[i]['color'] = Colors.getColors().Present;
              this.calendarData[i]['priority'] = 1;
              this.calendarData[i].title = "P"
            } else if (this.calendarData[i].title === 'Holiday') {
              this.calendarData[i]['color'] = Colors.getColors().Holiday;
              this.calendarData[i]['priority'] = 2;
            } else if (this.calendarData[i].title === 'Miss Punch') {
              this.calendarData[i]['color'] = Colors.getColors().MissPunch;
              this.calendarData[i]['priority'] = 2;
            } else if (this.calendarData[i].title === 'Optional Holiday') {
              this.calendarData[i]['color'] = Colors.getColors().Holiday;
              this.calendarData[i]['priority'] = 2;
            } else if (this.calendarData[i].title === 'Leave') {
              this.calendarData[i]['color'] = Colors.getColors().Leave;
              this.calendarData[i]['priority'] = 3;
            } else if (this.calendarData[i].title === 'PL') {
              this.calendarData[i]['color'] = Colors.getColors().Leave;
              this.calendarData[i]['priority'] = 3;
            } else if (this.calendarData[i].isShift == true) {
              this.calendarData[i]['color'] = Colors.getColors().shiftName;
              this.calendarData[i]['priority'] = 4;
            } else if (this.calendarData[i].title.includes('Present')) {
              this.calendarData[i]['priority'] = 1;

              if (this.calendarData[i].penaltyDeduction || this.calendarData[i].goEarlyPanaltyDeduction) { this.calendarData[i]['color'] = Colors.getColors().PenaltyWithDeduction; this.calendarData[i].title = this.calendarData[i].title.replace("Present", "P"); }
              else if (this.calendarData[i].title.includes('LC') || this.calendarData[i].title.includes('EG')) { this.calendarData[i]['color'] = Colors.getColors().PenaltyWithOutDeduction; this.calendarData[i].title = this.calendarData[i].title.replace("Present", "P"); }
              else { this.calendarData[i]['color'] = Colors.getColors().Present; this.calendarData[i].title = this.calendarData[i].title.replace("Present", "P"); }

            } else {
              this.calendarData[i]['priority'] = 3;
              this.calendarData[i]['color'] = Colors.getColors().Leave;
            }


            // if (this.calendarData[i].title === 'Optional Holiday') this.calendarData[i].title = "Optional<br> Holiday";
          }
          this.calendarOptions.events = this.calendarData;
          this.spinner.stop('start1');
        }
      });
  }

  alldata() {
    let filterData = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
      departmentID: '',
      designationID: '',
    };


    this.spinner.start()

    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          // this.spinner.stop();
        }
        this.spinner.stop()

      });
  }

  attendanceData(date) {
    let body = {
      userMasterID: this.uid ? this.uid : this.formValue.EmployeeAttendanceListComponent.id,
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
          // this.spinner.stop();
        }

        this.spinner.stop()
      });
  }

  employeeShift() {
    this.spinner.start();

    let userid = this.uid ? this.uid : this.formValue.EmployeeAttendanceListComponent.id;
    this.api
      .callApi(this.constant.GETEMPLOYEESHIFT + userid, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.modelShiftData = res.data;
          this.spinner.stop();
        }

      });
  }

  getAttendanceCalculation(attendanceTransactionId) {
    if (attendanceTransactionId) {
      try {
        this.spinner.start()

        this.api
          .callApi(
            this.constant.GETATTENDANCELOGBYTRANSID + Number(attendanceTransactionId),
            {},
            'GET',
            true,
            false,
            true,
          )
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.log = res.data;

            }
            this.spinner.stop();

          });
      } catch (e) {
        this.notifications.create('Error', e, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: true,
        });
        this.spinner.stop();

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
      userMasterID: this.uid ? this.uid : this.formValue.EmployeeAttendanceListComponent.id,
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
        }
        this.spinner.stop();

      });
  }

  closeModal1() {
    if (this.id) {
      this.onSubmit();
    } else {
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

      this.getCalenderData(
        [Number(this.formValue.EmployeeAttendanceListComponent.id)],
        this.CalendarStartDate,
        this.CalendarEndDate,
      );
    }
  }

  // manual(maindata) {
  //   if (maindata.attendanceType == '1') {
  //     maindata.punchin = maindata.attendance_date + ' ' + maindata.ShiftIntime;
  //     if (maindata.ShiftIntime > maindata.ShiftoutTime) {
  //       let outdate = new Date(maindata.attendance_date);

  //       outdate.setDate(outdate.getDate() + 1);

  //       let end_date =
  //         outdate.getFullYear() +
  //         '-' +
  //         String(outdate.getMonth() + 1).padStart(2, '0') +
  //         '-' +
  //         String(outdate.getDate()).padStart(2, '0');

  //       maindata.punchout = end_date + ' ' + maindata.ShiftoutTime;
  //     } else {
  //       maindata.punchout = maindata.attendance_date + ' ' + maindata.ShiftoutTime;
  //     }
  //   } else if (maindata.attendanceType == '0.5') {
  //     maindata.punchin = maindata.attendance_date + ' ' + maindata.ShiftIntime;

  //     if (maindata.ShiftIntime > maindata.halfday) {
  //       let outdate = new Date(maindata.attendance_date);

  //       outdate.setDate(outdate.getDate() + 1);

  //       let end_date =
  //         outdate.getFullYear() +
  //         '-' +
  //         String(outdate.getMonth() + 1).padStart(2, '0') +
  //         '-' +
  //         String(outdate.getDate()).padStart(2, '0');

  //       maindata.punchout = end_date + ' ' + maindata.halfday;
  //     } else {
  //       maindata.punchout = maindata.attendance_date + ' ' + maindata.halfday;
  //     }
  //   } else if (maindata.attendanceType == '0') {
  //     maindata.punchin = '';
  //     maindata.punchout = '';
  //   } else {
  //   }

  //   const result = this.finaldata.filter(
  //     (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
  //   );
  //   if (result.length > 0) {
  //     this.finaldata.splice(
  //       this.finaldata.findIndex(
  //         (s) => s.attendance_date == maindata.attendance_date && s.Userid == maindata.Userid,
  //       ),
  //       1,
  //     );
  //     if (maindata.punchin != '' || maindata.punchout != '') {
  //       this.finaldata.push(maindata);
  //     }

  //     if (
  //       maindata.punchin == '' &&
  //       maindata.punchout == '' &&
  //       (maindata.punchInTime != '' || maindata.punchOutTime != '')
  //     ) {
  //       this.finaldata.push(maindata);
  //     }
  //   } else {
  //     if (maindata.punchin != '' || maindata.punchout != '') {
  //       this.finaldata.push(maindata);
  //     }
  //     // if (maindata.punchin == '' && maindata.punchout == '') {
  //     //   this.finaldata.push(maindata)

  //     // }
  //     if (maindata.attendanceType == '0') {
  //       this.finaldata.push(maindata);
  //     }
  //   }

  //   for (var i = 0; i < this.finaldata.length; i++) {
  //     this.finaldata[i].createBy = localStorage.getItem('id');
  //     this.finaldata[i].updateBy = localStorage.getItem('id');
  //     this.finaldata[i].createByIp = this.ipAddress;
  //   }
  // }

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

  // onSubmitAttendaceForm() {
  //   if (this.radiostatus == '1') {
  //     if (this.addcomp.value.attendanceType == '' || !this.addcomp.value.attendanceType) {
  //       return;
  //     }

  //     if (this.addcomp.value.shiftID == '' || !this.addcomp.value.shiftID) {
  //       return;
  //     }

  //     if (this.addcomp.value.Comment == '' || !this.addcomp.value.Comment) {
  //       return;
  //     }
  //   }
  //   let userName = [];
  //   for (var i = 0; i < this.finaldata.length; i++) {
  //     if (this.finaldata[i].punchin != '' && this.finaldata[i].punchout != '') {
  //       let punchindate = this.finaldata[i].punchin.slice(0, 10);

  //       let punchintime = this.finaldata[i].punchin.slice(11, 19);

  //       let final_in = punchindate + ' ' + punchintime;

  //       let punchoutdate = this.finaldata[i].punchout.slice(0, 10);

  //       let punchouttime = this.finaldata[i].punchout.slice(11, 19);

  //       let final_out = punchoutdate + ' ' + punchouttime;

  //       if (new Date(final_in) <= new Date(final_out)) {
  //       } else {
  //         userName.push(this.finaldata[i].Name);
  //       }
  //     } else if (this.finaldata[i].punchin == '' && this.finaldata[i].punchout != '') {
  //       let punchoutdate = this.finaldata[i].punchout.slice(0, 10);

  //       let punchouttime = this.finaldata[i].punchout.slice(11, 19);

  //       let final_out = punchoutdate + ' ' + punchouttime;

  //       if (new Date(this.finaldata[i].punchInTime) <= new Date(final_out)) {
  //       } else {
  //         userName.push(this.finaldata[i].Name);
  //       }
  //     } else if (this.finaldata[i].punchin != '' && this.finaldata[i].punchout == '') {
  //       let punchindate = this.finaldata[i].punchin.slice(0, 10);

  //       let punchintime = this.finaldata[i].punchin.slice(11, 19);

  //       let final_in = punchindate + ' ' + punchintime;

  //       if (this.finaldata[i].punchOutTime != '' && this.finaldata[i].punchOutTime != null) {
  //         if (new Date(final_in) <= new Date(this.finaldata[i].punchOutTime)) {
  //         } else {
  //           userName.push(this.finaldata[i].Name);
  //         }
  //       }
  //     } else {
  //     }
  //   }
  //   if (userName.length > 0) {
  //     this.notifications.create(
  //       'Error',
  //       'user' + ' ' + userName + ' ' + 'punchout must be greater than punchin',
  //       NotificationType.Bare,
  //       {
  //         theClass: 'outline primary',
  //         timeOut: 3000,
  //         showProgressBar: false,
  //       },
  //     );
  //   } else {
  //     const body = {
  //       attendanceType: this.radiostatus,
  //       finaldataarray: this.finaldata,
  //       companyMasterID: this.manualcompanyMasterId,
  //     };

  //     this.spinner.start('start');

  //     this.api
  //       .callApi(this.constant.ADDMANUALATTENDANCE, body, 'POST', true, false, true)
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.notifications.create('Done', res.message, NotificationType.Bare, {
  //             theClass: 'outline primary',
  //             timeOut: 3000,
  //             showProgressBar: true,
  //           });
  //           setTimeout(() => {
  //             this.spinner.stop('start');

  //             this.closeModal.nativeElement.click();
  //           }, 3000);

  //         } else {
  //           this.modalMessage.show = true;
  //           this.modalMessage.modalMessage = res.message;
  //           this.spinner.stop('start');

  //         }
  //       });
  //   }
  // }

  extractDateTime(dateTimeStr) {
    return {
      date: dateTimeStr.slice(0, 10),
      time: dateTimeStr.slice(11, 19),
    };
  }

  combineDateTime({ date, time }) {
    return `${date} ${time}`;
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



  getShift(event) {
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


  getFormatDateTime(datetime) {
    var today = new Date(datetime);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    let h = (today.getHours() < 10 ? '0' : '') + today.getHours();
    let m = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

    return yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m;

  }

  getManualInfo() {
    let body = {
      companyMasterID: Number(this.comId),
      date: this.clickedDate,
      userMasterID: this.id ? [+this.id] : [+this.formValue.EmployeeAttendanceListComponent.id],
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
              this.manunalRows[i].punchin = this.getFormatDateTime(this.manunalRows[i].punchInTime);
            } else {
              this.manunalRows[i].punchin = '';
            }
            if (this.manunalRows[i].punchOutTime) {
              this.manunalRows[i].punchout = this.getFormatDateTime(this.manunalRows[i].punchOutTime);
            } else {
              this.manunalRows[i].punchout = '';
            }

            if (this.manunalRows[i].attendanceLogs && this.manunalRows[i].attendanceLogs.length > 0) {

              this.manunalRows[i].attendanceLogs = this.sortLogsByDateTime(this.manunalRows[i].attendanceLogs);

              for (let j = 0; j < this.manunalRows[i].attendanceLogs.length; j++) {
                this.logData.push({
                  logId: this.manunalRows[i].attendanceLogs[j].attendanceLogID,
                  logDateTime: this.getFormatDateTime(this.manunalRows[i].attendanceLogs[j].logDateTime),
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


  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onCorerectionData(userMasterId, date) {
    if (userMasterId && date) {
      this.spinner.start();
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
}
