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
    selector: 'app-edit-attendance-bonus-policy',
    templateUrl: './edit-attendance-bonus-policy.component.html',
    styleUrls: ['./edit-attendance-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAttendanceBonusPolicyComponent implements OnInit {
  @ViewChild('Editdata') Editdata: NgForm;

  adminRoot = environment.adminRoot;
  ipAddress: any;
  buttonState = '';
  buttonDisabled: Boolean = false;
  formValue: any;
  attendancedata: any;
  company_id: any;
  company: any = [];
  editData: any = [];
  finalcityid: any;
  countryid: any;
  state: any = [];
  city: any[];
  stateid: any;
  cityid: any;
  branchdata: any;
  country: any;
  allcomp: any;
  usertype: any;
  bankdata: any;
  bankMasterID: number;
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
  permissionedit: any = [];
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
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission()
    this.getIPAddress();
    this.getEditData();
    this.getcompany();
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

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceBonusPolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  selectcriteria(){
    this.attendancedata.hours = null;
  }


  onSubmit() {
    if (!this.Editdata.valid) {
      return;
    }

    const body = {
      companyMasterID: +this.Editdata.value.company,
      attendanceBonusPolicyName: this.Editdata.value.attendanceBonusPolicyName,
      setPresentDay: this.attendancedata.type == 'daily'? this.Editdata.value.setpresentday:null,
      noofPrentDay: this.attendancedata.type == 'daily' ? this.Editdata.value.days :null,
      attendanceBonustype:this.attendancedata.type == 'daily'? this.Editdata.value.bonustypes:null,
      attendanceBonusAmount: this.attendancedata.type == 'daily'? this.Editdata.value.amount:null,
      setNoattendanceBonusPolicy: this.Editdata.value.nobonus,
      slots: this.Editdata.value.slot,
      noofPrentDaySlot2: this.Editdata.value.slot == 'twoSlot' && this.attendancedata.type == 'daily' ? this.Editdata.value.days1 : null,
      attendanceBonustypeSlot2: this.Editdata.value.slot == 'twoSlot' && this.attendancedata.type == 'daily' ? this.Editdata.value.bonustypes1 : null,
      attendanceBonusAmountSlot2: this.Editdata.value.slot == 'twoSlot' && this.attendancedata.type == 'daily' ? this.Editdata.value.amount1 : null,
      type:this.attendancedata.type,
      min_bonus_hrs:
      this.attendancedata.type == 'hourly' ? this.attendancedata.min_bonus_hrs : null,
    bonus_criteria:
      this.attendancedata.type == 'hourly' ? this.attendancedata.bonus_criteria : null,
    hours: this.attendancedata.type == 'hourly' ? this.attendancedata.hours : null,
  
      updateByIp: this.ipAddress,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.ATTENDANCEBONUSPOLICYEDITDATA + this.formValue.ListAttendanceBonusPolicyComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
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

            }, 3000);
          } else {
            this.handleError(res.message);
            this.buttonDisabled = false;
            this.buttonState = '';
          }
          this.spinner.stop('start');

        },
        (err) => {
          this.buttonDisabled = false;
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
        },
      );
    this.spinner.stop('start');
  }


  onSetPresentDayChange(value: string) {

    this.setPresentDay = value;
    this.attendancedata.attendanceBonusAmount = null,
      this.attendancedata.attendanceBonustype = null,
      this.attendancedata.noofPrentDay = null,
      this.attendancedata.slots = null,
      this.attendancedata.noofPrentDaySlot2 = null,
      this.attendancedata.attendanceBonustypeSlot2 = null,
      this.attendancedata.attendanceBonusAmountSlot2 = null
  }

  onBonusTypeChange(value: string) {
    this.selectedBonusType = value;
  }

  getEditData() {
    const id = this.formValue.ListAttendanceBonusPolicyComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.ATTENDANCEBONUSPOLICYGETIDDATA + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop('start');
          this.attendancedata = res.data;
          if (this.attendancedata.noofPrentDay) this.setPresentDay = 'Fix';
          this.isNoAttendancebonus = this.attendancedata.setNoattendanceBonusPolicy
        },
        (err) => {
          this.spinner.stop('start');
          this.handleError(err.error.message);
        },
      );
    this.spinner.start('start');
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
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


  selectcompany(ev: any) {
    this.company = ev;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
