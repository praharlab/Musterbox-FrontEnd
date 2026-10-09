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
    selector: 'app-edit-salarypolicy',
    templateUrl: './edit-salarypolicy.component.html',
    styleUrls: ['./edit-salarypolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditSalarypolicyComponent implements OnInit {
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
  formValue: any;
  considerTimeType: any;
  considerTimeValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
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

  editdata() {
    let id = this.formValue.ListSalarypolicyComponent.id;
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
          this.considerTimeType =  this.salarypolicydata.considerTimeType;
          this.considerTimeValue =  this.salarypolicydata.considerTimeValue;

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
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }
  onSubmit() {
    if (!this.editsalarypolicy.valid) {
      return ;
    }
    

    if(this.salarypolicydata.salarycalculationBasedon == 'hourwise' && this.considerTimeType !='actual' && (this.considerTimeValue < 1 || this.considerTimeValue > 60) ){  
      return   this.notifications.create('Error', 'Minutes must be between 1 and 60!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });;
    }

    let body;
    if (this.childcompany == 'true') {
     
      body = {
        salaryPolicyID: this.formValue.ListSalarypolicyComponent.id,
        salaryPolicyName: this.editsalarypolicy.value.salaryPolicyName,
        salaryCycleDate: this.editsalarypolicy.value.salaryCycleDate,
        salaryCalculationDays: this.salaryCalculationbydays,
        salarycalculationBasedon: this.editsalarypolicy.value.monthwise,

        monthlyFixhours: this.monthlyFixhours,
        dailyFixhours: this.dailyFixhours,
        holidayHours: this.holidayHours,
        weekoffHours: this.weekoffHours,
        leaveHours: this.leaveHours,
        breakHours: this.breakHours,
        overtimeAdded: this.overtimeAdded,
        salaryCycleConsider:this.editsalarypolicy.value.salaryCycleConsider,
        considerTimeType:this.considerTimeType,
        considerTimeValue:this.considerTimeValue,
        

        // monthlyFixhours:this.editsalarypolicy.value.salarycalculatedonhours,
        // dailyFixhours:this.editsalarypolicy.value.dailyhours,
        // holidayHours:this.editsalarypolicy.value.holidayhours,
        // weekoffHours:this.editsalarypolicy.value.weekoffhours,
        // leaveHours:this.editsalarypolicy.value.leavehours,
        companyMasterID: localStorage.getItem('company_id'),
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
      // }
    } else {
      // if (this.days == false) {
      //   body = {
      //     salaryPolicyID: this.formValue.ListSalarypolicyComponent.id,
      //     salaryPolicyName: this.editsalarypolicy.value
      //       .salaryPolicyName,
      //     salaryCycleDate: this.editsalarypolicy.value.salaryCycleDate,
      //     salaryCalculationDays: null,
      //     companyMasterID: this.editsalarypolicy.value.company,
      //     upateBy: localStorage.getItem('id'),
      //     updateByIp: this.ipAddress
      //   }
      // }
      // else {
      body = {
        salaryPolicyID: this.formValue.ListSalarypolicyComponent.id,
        salaryPolicyName: this.editsalarypolicy.value.salaryPolicyName,
        salaryCycleDate: this.editsalarypolicy.value.salaryCycleDate,
        salaryCalculationDays: this.editsalarypolicy.value.salaryCalculationDays,
        salarycalculationBasedon: this.editsalarypolicy.value.monthwise,
        considerTimeType:this.considerTimeType,
        considerTimeValue:this.considerTimeValue,
        // monthlyFixhours: this.editsalarypolicy.value.salarycalculatedonhours,
        // dailyFixhours: this.editsalarypolicy.value.dailyhours,
        // holidayHours: this.editsalarypolicy.value.holidayhours,
        // weekoffHours: this.editsalarypolicy.value.weekoffhours,
        // leaveHours: this.editsalarypolicy.value.leavehours,

        monthlyFixhours: this.monthlyFixhours,
        dailyFixhours: this.dailyFixhours,
        holidayHours: this.holidayHours,
        weekoffHours: this.weekoffHours,
        leaveHours: this.leaveHours,
        breakHours: this.breakHours,
        overtimeAdded: this.overtimeAdded,
        salaryCycleConsider:this.editsalarypolicy.value.salaryCycleConsider,
        companyMasterID: this.editsalarypolicy.value.company,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
      // }
    }
    this.spinner.start();
    this.api.callApi(this.constant.UPDATESALARY, body, 'POST', true, true, true).subscribe(
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
