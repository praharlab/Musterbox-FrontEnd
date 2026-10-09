import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-add-salarypolicy',
    templateUrl: './add-salarypolicy.component.html',
    styleUrls: ['./add-salarypolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddSalarypolicyComponent implements OnInit {
  @ViewChild('addsalarypolicy') addsalarypolicy: NgForm;
  ipAddress: any;
  company_id: any;
  allcomp: any;
  childcompany: any;
  company: any;
  days: boolean;
  hours: boolean;
  monthhours: boolean;
  fixhours: boolean;
  dailyfixhours: boolean;
  adminRoot = environment.adminRoot;
  salarycal: any;
  monthlyhours: any;
  dailyhours: any;
  salaryCycleDate: any;
  salaryCalculationDays: any;
  monthlyFixhours: string;
  dailyFixhours: any;
  holidayHours: any;
  weekoffHours: any;
  leaveHours: any;
  salaryCalculationbydays: any;
  breakHours: any;
  overtimeAdded: any;
  formValue: any;
  datashow: boolean;
  selectedconsidertimeType: string = 'actual';

  salarypolicydata = {
    salaryPolicyName: null,
    salaryCycleDate: null,
    salaryCalculationDays: null,
    salarycalculationBasedon: null,
    status: null,
    monthlyFixhours: null,
    dailyFixhours: null,
    holidayHours: null,
    weekoffHours: null,
    leaveHours: null,
    breakHours: null,
    salaryCycleConsider: null,
    companyMasterID: null,
    overtimeAdded: null,
    considerTimeType: null,
    considerTimeValue: null,
  }
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.getIPAddress();
    this.getcompany();
    this.formValue = this.formValueStorageService.getData();


    if (this.formValue && this.formValue.cloneData && this.formValue.cloneData.id) {
      this.editdata();
    }
  }


  editdata() {
    let id = this.formValue.cloneData.id;

    this.spinner.start();
    this.api.callApi(this.constant.VIEWSALARYPOLICY + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.salarypolicydata = res.data;

        if (this.salarypolicydata.salarycalculationBasedon == 'daywise') {
          this.salaryCalculationbydays = this.salarypolicydata.salaryCalculationDays;

          this.days = true;
          this.hours = false;
          this.monthhours = false;
          this.fixhours = false;
          this.dailyfixhours = false;
        } else if (this.salarypolicydata.salarycalculationBasedon == 'hourwise') {
          this.holidayHours = this.salarypolicydata.holidayHours;
          this.weekoffHours = this.salarypolicydata.weekoffHours;
          this.leaveHours = this.salarypolicydata.leaveHours;
          this.breakHours = this.salarypolicydata.breakHours;
          this.overtimeAdded = this.salarypolicydata.overtimeAdded;
          this.days = false;
          this.hours = true;
          this.selectedconsidertimeType = this.salarypolicydata.considerTimeType;


          if (this.salarypolicydata.monthlyFixhours == null) {
            this.monthlyhours = 'monthhours';
            this.monthhours = true;

            if (this.salarypolicydata.dailyFixhours == null) {
              this.dailyhours = 'shifthours';
            } else {
              this.dailyhours = 'dailyfixhours';
              this.dailyfixhours = true;
              this.dailyFixhours = this.salarypolicydata.dailyFixhours;
            }
          } else {
            this.monthlyFixhours = this.salarypolicydata.monthlyFixhours;

            this.monthlyhours = 'fixhours';
            this.fixhours = true;
          }
        } else {
          this.days = false;
          this.hours = false;
          this.monthhours = false;
          this.fixhours = false;
          this.dailyfixhours = false;
        }


        this.spinner.stop();
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  callOvertimeType(event) {
    if (this.datashow == true || this.datashow == false) {
      if (!event) {
        this.addsalarypolicy.value.considerTimeType == null;
        this.addsalarypolicy.value.typeValue == null;
        this.selectedconsidertimeType == null;

      }
      if (event && event.target.value == 'actual') {
        this.addsalarypolicy.value.typeValue == null;
      }
    }
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
          this.allcomp = res.data;

          this.spinner.stop();
        }
      });
  }
  onSubmit() {
    if (!this.addsalarypolicy.valid) {
      return;
    }

    if ((this.addsalarypolicy.value.monthwise == 'hourwise' && this.selectedconsidertimeType != 'actual') && (this.salarypolicydata.considerTimeValue < 1 || this.salarypolicydata.considerTimeValue > 60)) {
      return this.notifications.create('Error', 'Minutes must be between 1 and 60!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });;
    }

    let body;
    if (this.childcompany == 'true') {
      body = {
        salaryPolicyName: this.addsalarypolicy.value.salaryPolicyName,
        salaryCycleDate: this.addsalarypolicy.value.salaryCycleDate,
        salaryCalculationDays: this.addsalarypolicy.value.salaryCalculationDays,
        salarycalculationBasedon: this.addsalarypolicy.value.monthwise,
        monthlyFixhours: this.addsalarypolicy.value.salarycalculatedonhours,
        dailyFixhours: this.addsalarypolicy.value.dailyhours,
        holidayHours: this.addsalarypolicy.value.holidayhours,
        weekoffHours: this.addsalarypolicy.value.weekoffhours,
        leaveHours: this.addsalarypolicy.value.leavehours,
        breakHours: this.addsalarypolicy.value.breakhours,
        overtimeAdded: this.addsalarypolicy.value.overtime,
        salaryCycleConsider: this.addsalarypolicy.value.salaryCycleConsider,
        companyMasterID: localStorage.getItem('company_id'),
        considerTimeType: this.selectedconsidertimeType,
        considerTimeValue: this.addsalarypolicy.value.typeValue,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        salaryPolicyName: this.addsalarypolicy.value.salaryPolicyName,
        salaryCycleDate: this.addsalarypolicy.value.salaryCycleDate,
        salaryCalculationDays: this.addsalarypolicy.value.salaryCalculationDays,
        salarycalculationBasedon: this.addsalarypolicy.value.monthwise,
        monthlyFixhours: this.addsalarypolicy.value.salarycalculatedonhours,
        dailyFixhours: this.addsalarypolicy.value.dailyhours,
        holidayHours: this.addsalarypolicy.value.holidayhours,
        weekoffHours: this.addsalarypolicy.value.weekoffhours,
        leaveHours: this.addsalarypolicy.value.leavehours,
        breakHours: this.addsalarypolicy.value.breakhours,
        overtimeAdded: this.addsalarypolicy.value.overtime,
        salaryCycleConsider: this.addsalarypolicy.value.salaryCycleConsider,
        companyMasterID: this.addsalarypolicy.value.company,
        considerTimeType: this.selectedconsidertimeType,
        considerTimeValue: this.addsalarypolicy.value.typeValue,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }


    this.spinner.start();
    this.api.callApi(this.constant.CREATESALARYPOLICY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/salary_policy']);

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

  showdays(ev) {
    if (ev.target.value == 'daywise') {
      this.days = true;
      this.hours = false;
      this.monthhours = false;
      this.fixhours = false;
      this.dailyfixhours = false;
    } else if (ev.target.value == 'hourwise') {
      this.days = false;
      this.hours = true;
      this.monthhours = false;
      this.fixhours = false;
      this.dailyfixhours = false;
    } else {
      this.days = false;
      this.hours = false;
      this.monthhours = false;
      this.fixhours = false;
      this.dailyfixhours = false;
    }
  }
  showhours(ev) {

    if (ev.target.value == 'monthhours') {
      this.monthhours = true;
      this.fixhours = false;
      this.dailyfixhours = false;
    } else if (ev.target.value == 'fixhours') {
      this.monthhours = false;
      this.fixhours = true;
      this.dailyfixhours = false;
    } else {
      this.monthhours = false;
      this.fixhours = false;
      this.dailyfixhours = false;
    }
  }

  showmonthlyhours(ev) {

    if (ev.target.value == 'dailyfixhours') {
      this.dailyfixhours = true;
    } else {
      this.dailyfixhours = false;
    }
  }
}
