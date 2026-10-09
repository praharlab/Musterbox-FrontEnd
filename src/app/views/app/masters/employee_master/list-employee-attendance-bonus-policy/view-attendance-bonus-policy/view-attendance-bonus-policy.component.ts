import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
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
    selector: 'app-view-attendance-bonus-policy',
    templateUrl: './view-attendance-bonus-policy.component.html',
    styleUrls: ['./view-attendance-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewAttendanceBonusPolicyComponent implements OnInit {
  attendanceBonusPolicyId: any;
  isChecked7: boolean;


  @Input()
  set attendanceBonusPolicyID(attendanceBonusPolicyID: any) {
    this.attendanceBonusPolicyId = attendanceBonusPolicyID;
  }
  @ViewChild('Editdata') Editdata: NgForm;
  childcompany: string;
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
    if (this.attendanceBonusPolicyId) {
      this.childcompany = localStorage.getItem('childcompany');
      this.getIPAddress();
      this.getEditData(this.attendanceBonusPolicyId);
      this.getcompany();
    }
    this.formValue = this.formValueStorageService.getData();
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission()
    this.getIPAddress();

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


  onSetPresentDayChange(value: string) {

    this.setPresentDay = value;
  }

  onBonusTypeChange(value: string) {
    this.selectedBonusType = value;
  }

  getEditData(attendanceBonusPolicyId) {
    this.spinner.start('start');
    this.api.callApi(this.constant.ATTENDANCEBONUSPOLICYGETIDDATA + attendanceBonusPolicyId, {}, 'GET', false, true, true)
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




  isNobonus(evt) {
    this.isNoAttendancebonus = evt.target.checked;

    if (evt.target.checked == true) {
      this.isChecked = false;
      this.isChecked1 = false;
      this.isChecked2 = false;
      this.isChecked3 = false;
      this.isChecked4 = false;
      this.isChecked5 = false;
      this.isChecked6 = false;
      this.isChecked7 =  false;
    }

  }
}
