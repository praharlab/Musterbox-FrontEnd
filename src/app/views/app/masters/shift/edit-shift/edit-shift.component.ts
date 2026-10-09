import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from '../../../../../constants/labelUtils';

@Component({
    selector: 'app-edit-shift',
    templateUrl: './edit-shift.component.html',
    styleUrls: ['./edit-shift.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditShiftComponent implements OnInit {
  @ViewChild('editshift') editshift: NgForm;
  ipAddress: any;
  shiftdata: any = [];
  company_id: any;
  company: any;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  starttime: any;
  totalhours: any;
  totalhourshalfday: any;
  endtime: any;
  secondhalfstarttime: any;
  firsthalfstarttime: any;
  deduction: any;
  Mondaystarttime: any;
  Mondayfirsthalfend: any;
  Mondaysecondhalfstart: any;
  Mondayendtime: any;
  Mondaytotalhours: any;
  Mondaytotalhourshalfday: any;

  Tuesdaystarttime: any;
  Tuesdayfirsthalfend: any;
  Tuesdaysecondhalfstart: any;
  Tuesdayendtime: any;
  Tuesdaytotalhours: any;
  Tuesdaytotalhourshalfday: any;

  Wednesdaystarttime: any;
  Wednesdayfirsthalfend: any;
  Wednesdaysecondhalfstart: any;
  Wednesdayendtime: any;
  Wednesdaytotalhours: any;
  Wednesdaytotalhourshalfday: any;

  Thursdaystarttime: any;
  Thursdayfirsthalfend: any;
  Thursdaysecondhalfstart: any;
  Thursdayendtime: any;
  Thursdaytotalhours: any;
  Thursdaytotalhourshalfday: any;

  Fridaystarttime: any;
  Fridayfirsthalfend: any;
  Fridaysecondhalfstart: any;
  Fridayendtime: any;
  Fridaytotalhours: any;
  Fridaytotalhourshalfday: any;

  Saturdaystarttime: any;
  Saturdayfirsthalfend: any;
  Saturdaysecondhalfstart: any;
  Saturdayendtime: any;
  Saturdaytotalhours: any;
  Saturdaytotalhourshalfday: any;

  Sundaystarttime: any;
  Sundayfirsthalfend: any;
  Sundaysecondhalfstart: any;
  Sundayendtime: any;
  Sundaytotalhours: any;
  Sundaytotalhourshalfday: any;

  sandwichleave: any;
  selectedcompany: any;
  table: any;
  alldepartment: any;
  alldesignation: any;
  allbranch: any;
  referncedata: any;
  allowpanelty: boolean = false;
  allowearlyby: boolean = false;
  showearlyby: any;
  show: any;
  by_Branch: boolean = false;
  predefined1: any = '0';
  selectedEarlyPenalty: any = '0';
  reference_ID: any;
  values: any = [];

  EarlyGovalues: any = [];
  allowearlybypenalty: boolean = false;
  selectedEarlyGoPenalty: any = 'slotminute';
  EarlyGodeduction: any;
  adminRoot = environment.adminRoot;
  // defaultPolicy = labelUtils.defaultPolicy;

  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.editdata();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
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
    this.alldesignation = [];
    this.alldepartment = [];
    if (value == '1') {
      this.by_Branch = true;
      this.shiftdata.table = '';
      this.shiftdata.branchID = '';
    } else {
      this.by_Branch = false;
    }

    this.api
      .callApi(
        this.constant.BRANCHBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
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
  gettable(event) {
    this.table = event;
    this.reference_ID = '';

    if (this.table == 'departments') {
      this.alldesignation = [];
      this.api
        .callApi(
          this.constant.DEPARTMENTBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
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
          this.constant.DESIGNATIONBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
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
    } else {
      this.alldesignation = [];
      this.alldepartment = [];
    }
  }
  editdata() {
    let companyid = this.formValue.ListShiftComponent.id;
    this.spinner.start();
    this.api.callApi(this.constant.VIEWSHIFT + companyid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.shiftdata = res.data;

        for (var i = 0; i < this.shiftdata.shiftTime.length; i++) {
          if (this.shiftdata.shiftTime[i].day == 'Monday') {
            this.Mondaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Mondayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Mondaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Mondayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Mondaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Mondaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Tuesday') {
            this.Tuesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Tuesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Tuesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Tuesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Tuesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Tuesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Wednesday') {
            this.Wednesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Wednesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Wednesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Wednesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Wednesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Wednesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Thursday') {
            this.Thursdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Thursdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Thursdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Thursdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Thursdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Thursdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Friday') {
            this.Fridaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Fridayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Fridaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Fridayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Fridaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Fridaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Saturday') {
            this.Saturdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Saturdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Saturdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Saturdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Saturdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Saturdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Sunday') {
            this.Sundaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Sundayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Sundaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Sundayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Sundaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Sundaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          }
        }

        if (
          !this.shiftdata.allowDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.lateComing &&
          !this.shiftdata.paneltyDeduction &&
          !this.shiftdata.paneltyDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.deductionOn
        ) {
          this.allowpanelty = false;
          this.show = '0';
        } else {
          this.allowpanelty = true;
          this.show = '1';
        }
        if (
          (!this.shiftdata.goEarly || this.shiftdata.goEarly == 0) &&
          !this.shiftdata.goEarlyallowdays
        ) {
          this.allowearlyby = false;
          this.showearlyby = '0';
        } else {
          this.allowearlyby = true;
          this.showearlyby = '1';
        }

        if (this.shiftdata.referenceId == 0) {
          this.shiftdata.referenceId = null;
        }
        if (this.shiftdata.branchID == 0) {
          this.shiftdata.branchID = null;
        }

        if (
          this.shiftdata.paneltyDeduction == 'slotminute' ||
          this.shiftdata.paneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.slot.length; i++) {
            this.values.push({ slot: this.shiftdata.slot[i], value: this.shiftdata.value[i] });
          }
        }

        if (
          this.shiftdata.goEarlyPaneltyDeduction == 'slotminute' ||
          this.shiftdata.goEarlyPaneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.goEarlyslot.length; i++) {
            this.EarlyGovalues.push({
              slot: this.shiftdata.goEarlyslot[i],
              value: this.shiftdata.goEarlyvalue[i],
            });
          }
          this.selectedEarlyPenalty = '1';
          this.allowearlybypenalty = true;
        }

        if (this.shiftdata.referenceId) {
          this.shiftdata.branchID = Number(this.shiftdata.branchID);
          this.by_Branch = true;
          this.predefined1 = '1';

          this.selectedcompany = this.shiftdata.companyMasterID;
          this.gettable(this.shiftdata.table);
          this.reference_ID = Number(this.shiftdata.referenceId);

          this.api
            .callApi(
              this.constant.BRANCHBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
              {},
              'GET',
              true,
              false,
              true,
            )
            .subscribe((res: any) => {
              this.allbranch = res;
            });
        } else {
          this.reference_ID = '';
        }
        // this.selectedcompany=this.shiftdata.companyMasterID;
        this.shiftdata.referenceId = Number(this.shiftdata.referenceId);
        //this.gettable(this.shiftdata.table)
        this.deduction = this.shiftdata.paneltyDeduction;
        this.spinner.stop();
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }
  changeallowEarly(value: any) {
    if (value == '1') {
      this.allowearlyby = true;
    } else {
      this.allowearlyby = false;
      this.allowearlybypenalty = false;
      this.EarlyGodeduction = '';
      this.EarlyGovalues = [];
      this.shiftdata.goEarlyPaneltyDeduction = null;
      this.selectedEarlyPenalty = '0';
      this.shiftdata.goEarlyallowdays = null;
      this.shiftdata.goEarly = null;
    }
  }
  changeallowEarlyPenalty(value: any) {
    this.EarlyGovalues = [];
    this.shiftdata.goEarlyPaneltyDeduction = null;
    if (value == '1') {
      this.allowearlybypenalty = true;
    } else {
      this.allowearlybypenalty = false;
    }
  }
  onSubmit() {
    if (!this.editshift.valid) {
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

    monday = {
      day: 'Monday',
      statTime: this.editshift.value.Mondaystarttime,
      firsthalfendtime: this.editshift.value.Mondayfirsthalfend,
      secondhalfstarttime: this.editshift.value.Mondaysecondhalfstart,
      endtime: this.editshift.value.Mondayendtime,
      totalhours: (Number(this.editshift.value.Mondaytotalhours) / 60).toFixed(2),
      totalhourshalfday: (Number(this.editshift.value.Mondaytotalhourshalfday) / 60).toFixed(2),
    };
    tuesday = {
      day: 'Tuesday',
      statTime: this.editshift.value.Tuesdaystarttime,
      firsthalfendtime: this.editshift.value.Tuesdayfirsthalfend,
      secondhalfstarttime: this.editshift.value.Tuesdaysecondhalfstart,
      endtime: this.editshift.value.Tuesdayendtime,
      totalhours: (Number(this.editshift.value.Tuesdaytotalhours) / 60).toFixed(2),
      totalhourshalfday: (Number(this.editshift.value.Tuesdaytotalhourshalfday) / 60).toFixed(2),
    };
    wednesday = {
      day: 'Wednesday',
      statTime: this.editshift.value.Wednesdaystarttime,
      firsthalfendtime: this.editshift.value.Wednesdayfirsthalfend,
      secondhalfstarttime: this.editshift.value.Wednesdaysecondhalfstart,
      endtime: this.editshift.value.Wednesdayendtime,
      totalhours: (Number(this.editshift.value.Wednesdaytotalhours) / 60).toFixed(2),
      totalhourshalfday: (Number(this.editshift.value.Wednesdaytotalhourshalfday) / 60).toFixed(2),
    };
    thursday = {
      day: 'Thursday',
      statTime: this.editshift.value.Thursdaystarttime,
      firsthalfendtime: this.editshift.value.Thursdayfirsthalfend,
      secondhalfstarttime: this.editshift.value.Thursdaysecondhalfstart,
      endtime: this.editshift.value.Thursdayendtime,
      totalhours: (Number(this.editshift.value.Thursdaytotalhours) / 60).toFixed(2),
      totalhourshalfday: (Number(this.editshift.value.Thursdaytotalhourshalfday) / 60).toFixed(2),
    };
    friday = {
      day: 'Friday',
      statTime: this.editshift.value.Fridaystarttime,
      firsthalfendtime: this.editshift.value.Fridayfirsthalfend,
      secondhalfstarttime: this.editshift.value.Fridaysecondhalfstart,
      endtime: this.editshift.value.Fridayendtime,
      totalhours: (Number(this.editshift.value.Fridaytotalhours) / 60).toFixed(2),
      totalhourshalfday: (Number(this.editshift.value.Fridaytotalhourshalfday) / 60).toFixed(2),
    };
    saturday = {
      day: 'Saturday',
      statTime: this.editshift.value.Saturdaystarttime,
      firsthalfendtime: this.editshift.value.Saturdayfirsthalfend,
      secondhalfstarttime: this.editshift.value.Saturdaysecondhalfstart,
      endtime: this.editshift.value.Saturdayendtime,
      totalhours: (Number(this.editshift.value.Saturdaytotalhours) / 60).toFixed(2),
      totalhourshalfday: (Number(this.editshift.value.Saturdaytotalhourshalfday) / 60).toFixed(2),
    };
    sunday = {
      day: 'Sunday',
      statTime: this.editshift.value.Sundaystarttime,
      firsthalfendtime: this.editshift.value.Sundayfirsthalfend,
      secondhalfstarttime: this.editshift.value.Sundaysecondhalfstart,
      endtime: this.editshift.value.Sundayendtime,
      totalhours: (Number(this.editshift.value.Sundaytotalhours) / 60).toFixed(2),
      totalhourshalfday: (Number(this.editshift.value.Sundaytotalhourshalfday) / 60).toFixed(2),
    };
    time.push(monday, tuesday, wednesday, thursday, friday, saturday, sunday);

    if (this.editshift.value.depdes == '0') {
      this.editshift.value.table = null;
      this.editshift.value.referenceId = null;
      this.editshift.value.branchID = null;
    }

    if (this.editshift.value.depdes == '0') {
      this.editshift.value.table = null;
      this.editshift.value.referenceId = null;
      this.editshift.value.branchID = null;
    }

    let body = {
      shiftID: this.shiftdata.shiftID,
      shiftName: this.editshift.value.shiftName,
      shiftCode: this.editshift.value.shiftCode,
      shiftDesc: this.editshift.value.shiftDesc,
      companyMasterID: this.editshift.value.companyMasterID,
      shiftGrace: this.editshift.value.graceminutes,
      deductionOn: this.editshift.value.deductionOn,
      shifttime: time,
      table: this.editshift.value.table,
      referenceId: this.editshift.value.referenceId,
      branchMasterID: this.editshift.value.branchID,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api.callApi(this.constant.UPDATESHIFT, body, 'POST', true, true, true).subscribe(
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
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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
    this.shiftdata.goEarlyPaneltyDeduction = event;
    if (this.shiftdata.goEarlyPaneltyDeduction) {
      this.EarlyGovalues = [];
      this.EarlyGovalues.push({ slot: null, value: null });
    } else {
      this.EarlyGovalues = [];
    }
  }

  getcompanyid(event) {
    this.selectedcompany = event;
  }
  clear() {
    this.shiftdata.referenceId = null;
  }

  checkLatecoming() {
    if (this.shiftdata.lateComing == 0 && this.shiftdata.graceIntime == 0) {
      return;
    }

    if (this.shiftdata.lateComing == 0 && this.shiftdata.graceIntime) {
      if (Number(this.shiftdata.lateComing) <= Number(this.shiftdata.graceIntime)) {
        this.shiftdata.lateComing = null;
        this.shiftdata.graceIntime = null;

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

    if (this.shiftdata.graceIntime == 0 && this.shiftdata.lateComing) {
      if (Number(this.shiftdata.lateComing) <= Number(this.shiftdata.graceIntime)) {
        this.shiftdata.lateComing = null;
        this.shiftdata.graceIntime = null;

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

    if (this.shiftdata.lateComing && this.shiftdata.graceIntime) {
      if (Number(this.shiftdata.lateComing) <= Number(this.shiftdata.graceIntime)) {
        this.shiftdata.lateComing = null;
        this.shiftdata.graceIntime = null;

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

  check1(id: any) {
    if (Number(this.shiftdata.shiftGrace) < 0) {
      this.shiftdata.shiftGrace = null;
      this.notifications.create('Error', 'Value must be Positive!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  check2() {
    if (Number(this.shiftdata.graceIntime) < 0) {
      this.shiftdata.graceIntime = null;
      this.notifications.create('Error', 'Value must be Positive!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  check3() {
    if (Number(this.shiftdata.lateComing) < 0) {
      this.shiftdata.lateComing = null;
      this.notifications.create('Error', 'Value must be Positive!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }

  check4() {
    if (Number(this.shiftdata.allowDays) < 0) {
      this.shiftdata.allowDays = null;
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
