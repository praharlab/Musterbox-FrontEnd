import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-my-outdoor-duty',
    templateUrl: './edit-my-outdoor-duty.component.html',
    styleUrls: ['./edit-my-outdoor-duty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditMyOutdoorDutyComponent implements OnInit {

  @ViewChild('editOutdoorDuty') editOutdoorDuty: NgForm;
  isdisabled = false;
  ipAddress: any;
  adminRoot = environment.adminRoot;

  leave: any;
  toda: boolean = false;
  index: any;
  LeaveType: any;
  today: any;
  formValue: any;
  optionalholiday: any = [];
  allLeaveType: any = [];
  LeaveTypeTemp: any = [];

  optionalholidayDates: any;
  image: any;
  apiURL = environment.apiUrl;
  removeItem: any = 0;
  employeeLeavePolicy: any;
  outdoorDuty: any;
  totalDays: number;
  constructor(
    private spinner: NgxUiLoaderService,
    private datePipe: DatePipe,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private modalService: ModalService,
    private formValueStorageService: FormValueStorageService,


  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getEditdata()
  }


  getEditdata() {
    this.spinner.start('getData');
    this.api
      .callApi(
        this.constant.GETLEAVEBYID + '/' + this.formValue.ListmyOutdoorDutyComponent.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.outdoorDuty = res.data;
          this.totalDays = this.outdoorDuty.LeaveDays;
          this.spinner.stop('getData');
        },
        (err) => {
          this.spinner.start('getData');
        },);

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
    if (this.outdoorDuty.DayType == 'First Half' || this.outdoorDuty.DayType == 'Second Half') {
      this.totalDays = 0.5;
      this.outdoorDuty.ToDate = ''
    }

    if (this.outdoorDuty.DayType == 'Full Day' && this.outdoorDuty.FromDate) {
      this.totalDays = 0;

      if (this.outdoorDuty.FromDate && this.outdoorDuty.ToDate) {
        this.totalDays = this.calculateDays(this.outdoorDuty.FromDate, this.outdoorDuty.ToDate)
      }

    }

  }

  onSubmit() {
    if (!this.editOutdoorDuty.valid) return

    const body = {
      userMasterID: localStorage.getItem('id'),
      companyMasterID: localStorage.getItem('company_id'),
      FromDate: this.outdoorDuty.FromDate,
      ToDate: (this.outdoorDuty.DayType == 'First Half' || this.outdoorDuty.DayType == 'Second Half') ? this.outdoorDuty.FromDate : this.outdoorDuty.ToDate,
      LeaveDays: this.totalDays,
      Remark: this.outdoorDuty.Remark,
      DayType: this.outdoorDuty.DayType,
    }

    this.spinner.start('edit')
    this.api.callApi(this.constant.UPDATEMYOUTDOORDUTY + this.formValue.ListmyOutdoorDutyComponent.id, body, 'PUT', true, true, true).subscribe(
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
            this.spinner.stop('edit');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('edit');
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('edit');
      },
    );
  }


}
