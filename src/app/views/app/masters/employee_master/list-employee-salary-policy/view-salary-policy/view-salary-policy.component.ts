import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-salary-policy',
    templateUrl: './view-salary-policy.component.html',
    styleUrls: ['./view-salary-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewSalaryPolicyComponent implements OnInit {
  salaryPolicyID: any;
  considerTimeType: any;
  considerTimeValue: any;

  @Input()
  set getSalaryPolicyID(getSalaryPolicyID: any) {
    this.salaryPolicyID = getSalaryPolicyID;
  }

  @ViewChild('editsalarypolicy') editsalarypolicy: NgForm;
  ipAddress: any;
  salarypolicydata: any = [];
  allcomp: any;
  childcompany: string;
  days: boolean;
  salarycal: any;
  hours: boolean;
  monthhours: boolean;
  fixhours: boolean;
  dailyfixhours: boolean;
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
  adminRoot = environment.adminRoot;

  overtimeAdded: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    if (this.salaryPolicyID) {
      this.childcompany = localStorage.getItem('childcompany');
      this.getIPAddress();
      this.editdata(this.salaryPolicyID);
      this.getcompany();
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
  editdata(salaryPolicyID) {
    let id = this.salaryPolicyID;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWSALARYPOLICY + salaryPolicyID, {}, 'GET', false, true, true)
      .subscribe(
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
            this.considerTimeType = this.salarypolicydata.considerTimeType;
            this.considerTimeValue = this.salarypolicydata.considerTimeValue;
            this.days = false;
            this.hours = true;

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

            // this.fixhours = false;
            // this.dailyfixhours = false
          } else {
            this.days = false;
            this.hours = false;
            this.monthhours = false;
            this.fixhours = false;
            this.dailyfixhours = false;
          }

          // if (this.salarypolicydata.salaryCalculationDays != null) {
          //   this.days = true;
          //   this.salarycal = "fixdays";
          // }
          // else {
          //   this.days = false
          //   this.salarycal = "monthwise";
          // }

          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
        },
      );
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

      this.holidayHours = null;
      this.weekoffHours = null;
      this.leaveHours = null;
      this.breakHours = null;
      this.overtimeAdded = null;
      this.considerTimeType = null;

      this.monthlyFixhours = null;
      this.dailyFixhours = null;
      this.monthlyhours = null;
      this.dailyhours = null;
    } else if (ev.target.value == 'hourwise') {
      this.days = false;
      this.hours = true;
      this.monthhours = false;
      this.fixhours = false;
      this.dailyfixhours = false;
      this.salaryCalculationbydays = null;
    } else {
      this.days = false;
      this.hours = false;
      this.monthhours = false;
      this.fixhours = false;
      this.dailyfixhours = false;

      this.holidayHours = null;
      this.weekoffHours = null;
      this.leaveHours = null;
      this.breakHours = null;
      this.overtimeAdded = null;
      this.considerTimeType = null;


      this.monthlyFixhours = null;
      this.dailyFixhours = null;
      this.salaryCalculationbydays = null;
      this.monthlyhours = null;
      this.dailyhours = null;
    }
  }
  showhours(ev) {

    if (ev.target.value == 'monthhours') {
      this.monthhours = true;
      this.fixhours = false;
      this.dailyfixhours = false;

      this.monthlyFixhours = null;
    } else if (ev.target.value == 'fixhours') {
      this.monthhours = false;
      this.fixhours = true;
      this.dailyfixhours = false;

      this.dailyhours = null;
      this.dailyFixhours = null;
    } else {
      this.monthhours = false;
      this.fixhours = false;
      this.dailyfixhours = false;
    }
  }

  showmonthlyhours(ev) {

    if (ev.target.value == 'dailyfixhours') {
      this.dailyfixhours = true;
      this.monthlyFixhours = null;
    } else {
      this.dailyfixhours = false;
      this.dailyFixhours = null;
    }
  }
}
