import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { log } from 'console';
import { add } from 'ngx-bootstrap/chronos';

@Component({
    selector: 'app-add-shift',
    templateUrl: './add-shift.component.html',
    styleUrls: ['./add-shift.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddShiftComponent implements OnInit {
  @ViewChild('addshift') addshift: NgForm;
  ipAddress: any;
  company_id: any;
  company: any;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  starttime: any;
  selectedall = false;
  totalhours: any;
  totalhourshalfday: any;
  endtime: any;
  secondhalfstarttime: any;
  firsthalfstarttime: any;
  deduction: any;
  selectedcompany: any;
  table: any;
  alldepartment: any;
  alldesignation: any;
  allbranch: any;
  allowpanelty: boolean = false;
  allowearlyby: boolean = false;
  allowgrace: boolean = false;
  predefined: any = '0';
  predefined1: any = '0';
  predefinedgrace: number = 0;
  by_Branch: boolean = false;
  show123: boolean = false;
  maxmin: any;
  graceintime: any;
  message: any = 'Value must be Positive!';
  maxdays: any;
  values: any = [];
  EarlyGovalues: any = [];
  allowearlybypenalty: boolean = false;
  selectedEarlyGoPenalty: any = 'slotminute';
  EarlyGodeduction: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getIPAddress();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop();
        }
      });
  }
  onSubmit() {
    if (!this.addshift.valid) {
      return;
    }

    const time = [];
    let monday;
    let tuesday;
    let wednesday;
    let thursday;
    let friday;
    let saturday;
    let sunday;
    if (this.selectedall == true) {
      monday = {
        day: 'Monday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
      tuesday = {
        day: 'Tuesday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
      wednesday = {
        day: 'Wednesday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
      thursday = {
        day: 'Thursday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
      friday = {
        day: 'Friday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
      saturday = {
        day: 'Saturday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
      sunday = {
        day: 'Sunday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
    } else {
      monday = {
        day: 'Monday',
        statTime: this.addshift.value.Mondaystarttime,
        firsthalfendtime: this.addshift.value.Mondayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Mondaysecondhalfstart,
        endtime: this.addshift.value.Mondayendtime,
        totalhours: (Number(this.addshift.value.Mondaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
      };
      tuesday = {
        day: 'Tuesday',
        statTime: this.addshift.value.Tuesdaystarttime,
        firsthalfendtime: this.addshift.value.Tuesdayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Tuesdaysecondhalfstart,
        endtime: this.addshift.value.Tuesdayendtime,
        totalhours: (Number(this.addshift.value.Tuesdaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Tuesdaytotalhourshalfday) / 60).toFixed(2),
      };
      wednesday = {
        day: 'Wednesday',
        statTime: this.addshift.value.Wednesdaystarttime,
        firsthalfendtime: this.addshift.value.Wednesdayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Wednesdaysecondhalfstart,
        endtime: this.addshift.value.Wednesdayendtime,
        totalhours: (Number(this.addshift.value.Wednesdaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Wednesdaytotalhourshalfday) / 60).toFixed(2),
      };
      thursday = {
        day: 'Thursday',
        statTime: this.addshift.value.Thursdaystarttime,
        firsthalfendtime: this.addshift.value.Thursdayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Thursdaysecondhalfstart,
        endtime: this.addshift.value.Thursdayendtime,
        totalhours: (Number(this.addshift.value.Thursdaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Thursdaytotalhourshalfday) / 60).toFixed(2),
      };
      friday = {
        day: 'Friday',
        statTime: this.addshift.value.Fridaystarttime,
        firsthalfendtime: this.addshift.value.Fridayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Fridaysecondhalfstart,
        endtime: this.addshift.value.Fridayendtime,
        totalhours: (Number(this.addshift.value.Fridaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Fridaytotalhourshalfday) / 60).toFixed(2),
      };
      saturday = {
        day: 'Saturday',
        statTime: this.addshift.value.Saturdaystarttime,
        firsthalfendtime: this.addshift.value.Saturdayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Saturdaysecondhalfstart,
        endtime: this.addshift.value.Saturdayendtime,
        totalhours: (Number(this.addshift.value.Saturdaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Saturdaytotalhourshalfday) / 60).toFixed(2),
      };
      sunday = {
        day: 'Sunday',
        statTime: this.addshift.value.Sundaystarttime,
        firsthalfendtime: this.addshift.value.Sundayfirsthalfend,
        secondhalfstarttime: this.addshift.value.Sundaysecondhalfstart,
        endtime: this.addshift.value.Sundayendtime,
        totalhours: (Number(this.addshift.value.Sundaytotalhours) / 60).toFixed(2),
        totalhourshalfday: (Number(this.addshift.value.Sundaytotalhourshalfday) / 60).toFixed(2),
      };
    }
    (sunday);

    time.push(monday, tuesday, wednesday, thursday, friday, saturday, sunday);



    if (this.addshift.value.depdes == '0') {
      this.addshift.value.table = null;
      this.addshift.value.referenceId = null;
      this.addshift.value.branchID = null;
    }

    let body = {
      shiftName: this.addshift.value.shiftName,
      shiftCode: this.addshift.value.shiftCode,
      shiftDesc: this.addshift.value.shiftDesc,
      companyMasterID: this.addshift.value.companyMasterID,
      deductionOn: this.addshift.value.deductionOn,
      shifttime: time,
      shiftGrace: this.addshift.value.graceminutes,
      table: this.addshift.value.table,
      referenceId: this.addshift.value.referenceId,
      branchMasterID: this.addshift.value.branchID,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATESHIFT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/shift']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  changeallow(value: any) {
    if (value == '1') {
      this.allowpanelty = true;
    } else {
      this.allowpanelty = false;
      this.values = [];
    }
  }
  byBranch(value: any) {
    if (value == 1 && !this.addshift.value.companyMasterID) {
      this.notifications.create('Error', 'Please Select Company', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      this.predefined1 = '0';
      //return;
    }

    this.alldesignation = [];
    this.alldepartment = [];
    if (value == '1') {
      this.by_Branch = true;
    } else {
      this.by_Branch = false;
    }

    this.api
      .callApi(
        this.constant.BRANCHBYCOMPANYDATA1 + this.selectedcompany,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allbranch = res;
      });
  }
  changeallowEarly(value: any) {
    if (value == '1') {
      this.allowearlyby = true;
    } else {
      this.allowearlyby = false;
      this.allowearlybypenalty = false;
      this.EarlyGodeduction = '';
      this.EarlyGovalues = [];
    }
  }
  changeallowEarlyPenalty(value: any) {
    this.EarlyGovalues = [];
    if (value == '1') {
      this.allowearlybypenalty = true;
    } else {
      this.allowearlybypenalty = false;
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  selectcheck(event: any) {
    this.selectedall = event.target.checked;
  }
  funstarttime(event) {
    this.starttime = event;
  }
  funfirsthalftime(event: any) {
    this.firsthalfstarttime = event;
  }
  funsecondhalftime(event: any) {
    this.secondhalfstarttime = event;
  }
  funendtime(event: any) {
    this.endtime = event;
  }
  funtotalhours(event: any) {
    this.totalhours = event.target.value;
  }
  funtotalhourshalfday(event: any) {
    this.totalhourshalfday = event.target.value;
  }
  paneltydeduction(event: any) {
    this.deduction = event;
    if (this.deduction == 'slotminute' || this.deduction == 'slotamount') {
      this.values = [];
      this.values.push({ slot: null, value: null });
    } else {
      this.values = [];
    }
  }
  Earlypaneltydeduction(event: any) {
    this.EarlyGodeduction = event;
    if (this.EarlyGodeduction) {
      this.EarlyGovalues = [];
      this.EarlyGovalues.push({ slot: null, value: null });
    } else {
      this.EarlyGovalues = [];
    }
  }

  getcompanyid(event) {
    this.selectedcompany = event;
    this.predefined1 = '0';
    this.show123 = true;
  }
  gettable(event) {
    this.table = event;

    if (this.table == 'departments') {
      this.alldesignation = [];
      this.api
        .callApi(
          this.constant.DEPARTMENTBYCOMPANYDATA1 + this.selectedcompany,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldepartment = res.data;
          }
        });
    } else if (this.table == 'designations') {
      this.alldepartment = [];
      this.api
        .callApi(
          this.constant.DESIGNATIONBYCOMPANYDATA1 + this.selectedcompany,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldesignation = res.data;
          }
        });
    }
  }

  checkLatecoming() {

    if (this.maxmin == 0 && this.graceintime == 0) {
      return;
    }

    if (this.maxmin == 0 && this.graceintime) {
      if (Number(this.maxmin) <= Number(this.graceintime)) {
        this.maxmin = null;
        this.graceintime = null;

        this.notifications.create(
          'Error',
          'Maximum minutes allowed for late coming should be greater than Grace In time',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
      return;
    }

    if (this.graceintime == 0 && this.maxmin) {
      if (Number(this.maxmin) <= Number(this.graceintime)) {
        this.maxmin = null;
        this.graceintime = null;

        this.notifications.create(
          'Error',
          'Maximum minutes allowed for late coming should be greater than Grace In time',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
      return;
    }

    if (this.maxmin && this.graceintime) {
      if (Number(this.maxmin) <= Number(this.graceintime)) {
        this.maxmin = null;
        this.graceintime = null;

        this.notifications.create(
          'Error',
          'Maximum minutes allowed for late coming should be greater than Grace In time',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }
    }
  }

  check1() {
    if (Number(this.predefinedgrace) < 0) {
      this.predefinedgrace = null;
      this.notifications.create('Error', 'Value must be Positive!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  check2() {
    if (Number(this.graceintime) < 0) {
      this.graceintime = null;
      this.notifications.create('Error', 'Value must be Positive!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  check3() {
    if (Number(this.maxmin) < 0) {
      this.maxmin = null;
      this.notifications.create('Error', 'Value must be Positive!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  check4() {
    if (Number(this.maxdays) < 0) {
      this.maxdays = null;
      this.notifications.create('Error', 'Value must be Positive!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  removevalue(i: any) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ slot: null, value: null });
  }
  removevalueEarlyGo(i: any) {
    this.EarlyGovalues.splice(i, 1);
  }

  addvalueEarlyGo() {
    this.EarlyGovalues.push({ slot: null, value: null });
  }
}
