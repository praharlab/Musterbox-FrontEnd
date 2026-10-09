import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-add-my-outdoor-duty',
    templateUrl: './add-my-outdoor-duty.component.html',
    styleUrls: ['./add-my-outdoor-duty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMyOutdoorDutyComponent implements OnInit {

  @ViewChild('addOutdoorDuty') addOutdoorDuty: NgForm;
  isdisabled = false;
  ipAddress: any;
  adminRoot = environment.adminRoot;

  public addleave: any = [];
  toda: boolean = false;
  index: any;
  LeaveType: any;
  today: any;
  optionalholiday: any = [];
  optionalholidayArray: any = [];
  leaveTypeArray: any = []
  allLeaveType: any = [];
  image: null;
  employeeLeavePolicy: any;
  totalDays: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private datePipe: DatePipe,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const diffInMs = end.getTime() - start.getTime();

    // Convert milliseconds to days
    return (diffInMs + (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24);
  };


  changeDay() {
    if (this.addOutdoorDuty.value.dayType == 'First Half' || this.addOutdoorDuty.value.dayType == 'Second Half') {
      this.totalDays = 0.5;
      this.addOutdoorDuty.value.to = '';
    }

    if (this.addOutdoorDuty.value.dayType == 'Full Day' && this.addOutdoorDuty.value.from) {
      this.totalDays = 0;

      if (this.addOutdoorDuty.value.from && this.addOutdoorDuty.value.to) {
        this.totalDays = this.calculateDays(this.addOutdoorDuty.value.from, this.addOutdoorDuty.value.to)
      }

    }

  }


  onSubmit() {

    if (!this.addOutdoorDuty.valid) return

    const body = {
      userMasterID: localStorage.getItem('id'),
      companyMasterID: localStorage.getItem('company_id'),
      FromDate: this.addOutdoorDuty.value.from,
      ToDate: (this.addOutdoorDuty.value.dayType == 'First Half' || this.addOutdoorDuty.value.dayType == 'Second Half') ? this.addOutdoorDuty.value.from : this.addOutdoorDuty.value.to,
      LeaveDays: this.totalDays,
      Remark: this.addOutdoorDuty.value.reason,
      DayType: this.addOutdoorDuty.value.dayType,
    }


    this.spinner.start('add')
    this.api.callApi(this.constant.ADDMYOUTDOORDUTY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.router.navigate([this.adminRoot + '/attendances/my_Outdoor_Duty']);
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          this.spinner.stop('add');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('add');
      },
    );

  }

}
