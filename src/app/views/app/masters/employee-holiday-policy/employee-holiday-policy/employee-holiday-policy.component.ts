import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ViweEmployeeHolidayPolicyComponent } from '../viwe-employee-holiday-policy/viwe-employee-holiday-policy.component';

@Component({
    selector: 'app-employee-holiday-policy',
    templateUrl: './employee-holiday-policy.component.html',
    styleUrls: ['./employee-holiday-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeHolidayPolicyComponent implements OnInit {

  @ViewChild(ViweEmployeeHolidayPolicyComponent)
  viewEmployeeHolidayPolicyComponent: ViweEmployeeHolidayPolicyComponent;

  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];

  temp = [];
  @ViewChild('myInput')
 
  ipAddress: any;
  rows1: any = [];
  editbyid: any;
  company_id: any;

  activesalarydate: any;
  dateNG: any = '';
  visibledate: any;
  getHolidayPolicyID: any;
  selectedHolidayPolicyName: string;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
  
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
 

    this.company_id = localStorage.getItem('company_id');
    this.profileStatusService.refreshProfileStatus();
  }
 
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.HOLDAYBYCOMPANYDATA + +localStorage.getItem('id'),
      {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;

      
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  edit(item) {
    this.editbyid = item;
  }


 
  checksalaryDate(date: any) {
    let Fdate = date.substring(8, 10);
    let month = date.substring(5, 7);

    if (Number(Fdate) != Number(this.activesalarydate)) {
      this.dateNG = '';
      alert('Weekoff policy can only be assigned ' + Number(this.activesalarydate) + ' of month');
    }
  }
  getSalaryDate() {
    const body = {
      userMasterID:+localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETACTIVESALARYPOLIY, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.visibledate = res.date;

        if (res.status == 400) {
          this.activesalarydate = '01';
          this.spinner.stop();
        } else if (res.status == 200) {
          if (Number(res.data['salaryPolicy.salaryCalculationDays']) < 10) {
            this.activesalarydate = '0' + res.data['salaryPolicy.salaryCalculationDays'].toString();
          } else {
            this.activesalarydate = res.data['salaryPolicy.salaryCalculationDays'].toString();
          }
          this.spinner.stop();
        }
      });
  }

  getHolidayPolicyDataModal(item: any) {
    this.getHolidayPolicyID = item.holidayPolicyID;
    this.viewEmployeeHolidayPolicyComponent.holidayPolicyID = item.holidayPolicyID;
    this.viewEmployeeHolidayPolicyComponent.ngOnInit();
    this.selectedHolidayPolicyName = item.HolidayPolicy.holidayPolicyName;
  }
}
