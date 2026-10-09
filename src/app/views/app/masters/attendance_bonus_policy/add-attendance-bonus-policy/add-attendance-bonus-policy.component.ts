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
@Component({
    selector: 'app-add-attendance-bonus-policy',
    templateUrl: './add-attendance-bonus-policy.component.html',
    styleUrls: ['./add-attendance-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAttendanceBonusPolicyComponent implements OnInit {
  @ViewChild('adddata') adddata: NgForm;

  ipAddress: any;
  adminRoot = environment.adminRoot;
  finalcityid: any;
  city: any;
  selectedcity: any;
  state: any;
  country: any;
  selectedstate: string;
  companyMasterID: string;
  company_id: any;
  company: any = [];
  comp: any;
  buttonState: string = 'idle';
  buttonDisabled: boolean = false;
  setPresentDay: string = '';
  selectedBonusType: string = '';
  selectedOption: string = '';
  isNoAttendancebonus: boolean = false;
  isChecked: any;
  isChecked2: any;
  isChecked3: any;
  isChecked4: any;
  isChecked6: any;
  isChecked5: any;
  isChecked1: any;
  permissioncreate: any = [];
  formValue: any;
  companyid: any;
  attendancedata = {
    companyMasterID: null,
    attendanceBonusAmount: null,
    attendanceBonusPolicyName: null,
    attendanceBonustype: null,
    noofPrentDay: null,
    setNoattendanceBonusPolicy: false,
    slots: null,
    setPresentDay:null,
    noofPrentDaySlot2: null,
    attendanceBonustypeSlot2: null,
    attendanceBonusAmountSlot2: null,
    type: null,
    min_bonus_hrs: null,
    bonus_criteria: null,
    hours: null,
  };
  isChecked7: boolean;

  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.companyMasterID = localStorage.getItem('company_id');
    this.formValue = this.formValueStorageService.getData();
    this.getcompany();
    this.checkpermission();
    this.getIPAddress();

    if (
      this.formValue &&
      this.formValue.attendance_bonus_policy_cloneData &&
      this.formValue.attendance_bonus_policy_cloneData.id
    ) {
      this.getEditData();
    }
  }

  // getEditData() {
  //   this.spinner.start('start');
  //   const id = this.formValue.cloneData.id;

  //   this.api.callApi(this.constant.ATTENDANCEBONUSPOLICYGETIDDATA + id, {}, 'GET', false, true, true)
  //     .subscribe(
  //       (res: any) => {
  //         this.spinner.stop('start');
  //         this.attendancedata = res.data;
  //         this.companyid = this.attendancedata.companyMasterID;

  //         if (this.attendancedata.noofPrentDay) this.setPresentDay = 'Fix';
  //         this.isNoAttendancebonus = this.attendancedata.setNoattendanceBonusPolicy
  //       },
  //       (err) => {
  //         this.spinner.stop('start');
  //         this.handleError(err.error.message);
  //       },
  //     );
  //   this.spinner.start('start');
  // }

  getEditData() {
    this.spinner.start('start');
    const id = this.formValue.attendance_bonus_policy_cloneData.id;
    this.api
      .callApi(this.constant.ATTENDANCEBONUSPOLICYGETIDDATA + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop('start');
          this.attendancedata = res.data;
          this.companyid = this.attendancedata.companyMasterID;
          if (this.attendancedata.noofPrentDay) this.setPresentDay = 'Fix';
          this.isNoAttendancebonus = this.attendancedata.setNoattendanceBonusPolicy;
        },
        (err) => {
          this.spinner.stop('start');
          this.handleError(err.error.message);
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };

    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.spinner.stop('company');
          this.comp = res.data;
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

  checkpermission() {
    this.spinner.start('permission');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;

          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceBonusPolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  setAttendanceBonusType() {
    this.attendancedata.attendanceBonusAmount = null;
    this.attendancedata.attendanceBonustype = null;
    this.attendancedata.noofPrentDay = null;
    this.attendancedata.slots = null;
    this.attendancedata.noofPrentDaySlot2 = null;
    this.attendancedata.attendanceBonustypeSlot2 = null;
    this.attendancedata.attendanceBonusAmountSlot2 = null;
    this.attendancedata.min_bonus_hrs = null;
    this.attendancedata.bonus_criteria = null;
    this.attendancedata.hours = null;
  }

  onSetPresentDayChange(value: string) {
    this.setPresentDay = value;

    (this.attendancedata.attendanceBonusAmount = null),
      (this.attendancedata.attendanceBonustype = null),
      (this.attendancedata.noofPrentDay = null),
      (this.attendancedata.slots = null),
      (this.attendancedata.noofPrentDaySlot2 = null),
      (this.attendancedata.attendanceBonustypeSlot2 = null),
      (this.attendancedata.attendanceBonusAmountSlot2 = null);
  }
  // onBonusTypeChange(value: string) {
  //   this.selectedBonusType = value;
  // }

  onSubmit() {
    if (!this.adddata.valid) {
      return;
    }
    this.spinner.start('start');
    let body = {
      companyMasterID: +this.adddata.value.company,
      attendanceBonusPolicyName: this.adddata.value.OrgName,
      setPresentDay: this.attendancedata.type == 'daily' ? this.adddata.value.setpresentday : null,
      noofPrentDay:
        this.attendancedata.type == 'daily' && this.adddata.value.days
          ? this.adddata.value.days
          : null,
      attendanceBonustype:
        this.attendancedata.type == 'daily' ? this.adddata.value.bonustypes : null,
      attendanceBonusAmount: this.attendancedata.type == 'daily' ? this.adddata.value.amount : null,
      setNoattendanceBonusPolicy: this.adddata.value.nobonus,
      slots: this.attendancedata.type == 'daily' ? this.adddata.value.slot : null,
      noofPrentDaySlot2:
        this.adddata.value.slot == 'twoSlot' && this.attendancedata.type == 'daily'
          ? this.adddata.value.days1
          : null,
      attendanceBonustypeSlot2:
        this.adddata.value.slot == 'twoSlot' && this.attendancedata.type == 'daily'
          ? this.adddata.value.bonustypes1
          : null,
      attendanceBonusAmountSlot2:
        this.adddata.value.slot == 'twoSlot' && this.attendancedata.type == 'daily'
          ? this.adddata.value.amount1
          : null,
          type:this.attendancedata.type,
      min_bonus_hrs:
        this.attendancedata.type == 'hourly' ? this.attendancedata.min_bonus_hrs : null,
      bonus_criteria:
        this.attendancedata.type == 'hourly' ? this.attendancedata.bonus_criteria : null,
      hours: this.attendancedata.type == 'hourly' ? this.attendancedata.hours : null,
      createBy: +localStorage.getItem('id'),
    };

    this.api
      .callApi(this.constant.ATTENDANCEBONUSPOLICYADD, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/attendance_bonus_policy']);
              this.buttonDisabled = false;
              this.buttonState = '';
              this.spinner.stop('start');
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop('start');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
        },
      );
  }

  selectcriteria(){
    this.attendancedata.hours = null;
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  isNobonus(evt) {
    this.isNoAttendancebonus = evt.target.checked;

    if (evt.target.checked == true) {
      this.setAttendanceBonusType();
      this.isChecked = false;
      this.isChecked1 = false;
      this.isChecked2 = false;
      this.isChecked3 = false;
      this.isChecked4 = false;
      this.isChecked5 = false;
      this.isChecked6 = false;
      this.isChecked7 = false;
    }
  }
}
