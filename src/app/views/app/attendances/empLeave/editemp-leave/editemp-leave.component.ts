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
    selector: 'app-editemp-leave',
    templateUrl: './editemp-leave.component.html',
    styleUrls: ['./editemp-leave.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditempLeaveComponent implements OnInit {
  @ViewChild('editEMPleave') editEMPleave: NgForm;
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

    this.getIPAddress();
    this.getLeaveType();
    this.getEditdata();
    this.getIPAddress(),
      this.getLeavePolicy()

    Promise.all([
      this.getLeaveType(),
      this.getEditdata()]).then(() => this.checkOptionalLeave(this.leave.FromDate));

    let date = new Date();
    this.today = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  private getLeaveType(): Promise<void> {

    let bb = {
      parameters: [+localStorage.getItem('company_id')],
    };
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('leaveType');
      this.api
        .callApi(this.constant.commonfun + '/GetLeavesName', bb, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allLeaveType = [...res.data];
            this.LeaveTypeTemp = [...res.data.filter(e => e.leaveid != 24)];
            this.LeaveType = this.LeaveTypeTemp
            this.spinner.stop('leaveType');
          }
          resolve();
        },
          (err) => {
            this.spinner.start('leaveType');
            console.error(err, 'ERROR'); // Log the error
            reject(err); // Reject the Promise in case of an error
          },);
    });
  }

  getLeavePolicy() {
    this.spinner.start('getLeave');
    this.api
      .callApi(this.constant.GETEMPLEAVEPOLICYDATABYUSERID + localStorage.getItem('id'), {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeeLeavePolicy = res.data.find(e => e.leavePolicyStatus == 'active');
        }
        this.spinner.stop('getLeave');
      });
  }

  selectLeaveType(id: any) {

    this.leave.minLeaveAttachment = null

    if (!id) return;

    // get selectedLeave Type
    const currentLeaveType = this.LeaveType.find(e => e.leavetran == id);

    if (!currentLeaveType || !this.employeeLeavePolicy) return;
    //  get leave Policy of  selectedLeave Type
    const leavePolicy = this.employeeLeavePolicy.leavePolicy.find(e => e.leaveId == currentLeaveType.leaveid);

    if (leavePolicy && +leavePolicy.min_leave_attachment > 0) this.leave.minLeaveAttachment = +leavePolicy.min_leave_attachment;

  }


  private getEditdata(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('getData');
      this.api
        .callApi(
          this.constant.GETLEAVEBYID + '/' + this.formValue.ListempLeaveComponent.id,
          {},
          'GET',
          false,
          true,
          true,
        )
        .subscribe(
          (res: any) => {
            this.leave = res.data;
            this.selectLeaveType(parseInt(this.leave.LeaveTranId));
            this.leave.LeaveTranId = parseInt(this.leave.LeaveTranId);
            this.leave.FromDate = this.datePipe.transform(this.leave.FromDate, 'yyyy-MM-dd');
            this.leave.ToDate = this.datePipe.transform(this.leave.ToDate, 'yyyy-MM-dd');
            this.spinner.stop('getData');


            resolve();
          },
          (err) => {
            this.spinner.start('getData');
            console.error(err, 'ERROR'); // Log the error
            reject(err); // Reject the Promise in case of an error
          },);
    });
  }

  changeDay() {
    var datelist = [];
    if (this.leave.DayType == 'First Half') {
      if (this.leave.FomDate != '') {
        this.leave.LeaveDays = 0.5;
        this.leave.ToDate = this.leave.FromDate;
        datelist.push(this.leave.FromDate);
      }
    } else if (this.leave.DayType == 'Second Half') {
      if (this.leave.FromDate != '') {
        this.leave.LeaveDays = 0.5;
        this.leave.ToDate = this.leave.FromDate;
        datelist.push(this.leave.FromDate);
      }
    } else {
      if (this.leave.FromDate != '' && this.leave.ToDate != '') {
        let fdate = new Date(this.leave.FromDate).getTime();
        let tdate = new Date(this.leave.ToDate).getTime();
        // element.days= ((tdate-fdate)/86400000) + 1;
        this.leave.LeaveDays = (tdate - fdate) / (1000 * 3600 * 24) + 1;
        if (this.leave.LeaveDays != '1' && this.leave.LeaveDays != 1) {
          var newDate = this.leave.FromDate;
          while (newDate <= this.leave.ToDate) {
            datelist.push(newDate);
            let date = new Date(newDate);
            date.setDate(date.getDate() + 1);
            newDate = this.datePipe.transform(date, 'yyyy-MM-dd');
          }
        } else {
          datelist.push(this.leave.FromDate);
        }
      }
    }
    var duplicatedate = datelist.some(function (item) {
      return datelist.indexOf(item) !== datelist.lastIndexOf(item);
    });
    if (duplicatedate == true) {
      this.notifications.create(
        'Error',
        "You can't Apply Same Date leave , Please Change and try Again!!",
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
      this.isdisabled = true;
    } else {
      this.isdisabled = false;
    }
  }

  onFileChange(event: any) {


    this.image = null

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    else this.image = null

    // this.leave.attachment = this.image


  }

  view(item: any) {
    window.open(this.apiURL + 'uploads/employee-leave-attachment/' + item, '_blank');
  }

  changeRemoveItem() {
    this.removeItem = 1
    this.leave.attachment = null
  }

  onSubmit() {
    if (!this.editEMPleave.valid) return

    const formData = new FormData();
    formData.append(`UserLeaveApplicationID`, this.leave.UserLeaveApplicationID);
    formData.append(`LeaveTranId`, this.leave.LeaveTranId);
    formData.append(`userMasterID`, this.leave.userMasterID);
    formData.append(`FromDate`, this.leave.FromDate);
    formData.append(`ToDate`, this.leave.ToDate);
    formData.append(`companyMasterID`, this.leave.companyMasterID);
    formData.append(`LeaveDays`, this.leave.LeaveDays);
    formData.append(`Remark`, this.leave.Remark);
    formData.append(`DayType`, this.leave.DayType);
    formData.append(`Authorization`, '0');
    formData.append(`attachment`, this.image);
    formData.append(`createByIp`, this.ipAddress);
    formData.append('removeFile', this.removeItem);


    this.api.callApi(this.constant.UPDATEEMPLEAVE, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.router.navigate([this.adminRoot + '/attendances/employeeLeave']);
            this.isdisabled = false;
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.isdisabled = false;
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.isdisabled = false;
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  checkOptionalLeave(event) {

    const optionalLeave = this.allLeaveType.find(e => e.leaveid == 24);
    if (!optionalLeave) return
    // if from date is null 
    if (!this.leave.FromDate) {
      this.LeaveType = this.LeaveTypeTemp;
      if (this.leave.LeaveTranId == optionalLeave.leavetran) {
        this.leave.LeaveTranId = ''
      }
    }

    let string = `?userMasterID=${localStorage.getItem('id')}`
    if (this.leave.FromDate && this.leave.ToDate) {

      string += `&startDate=${this.leave.FromDate}&endDate=${this.leave.ToDate}`

      this.spinner.start('check');
      this.api
        .callApi(this.constant.CHECKOPTIONALLEAVEOFUSER + string, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.optionalholiday = res.data

            this.optionalholidayDates = this.optionalholiday.map(e => e.date).join(' , ');

            if (this.optionalholidayDates && this.leave.FromDate == this.leave.ToDate) {
              this.LeaveType = this.allLeaveType;
            } else {
              this.LeaveType = this.LeaveTypeTemp;
              // to empty leavetype
              if (this.leave.LeaveTranId == optionalLeave.leavetran) {
                this.leave.LeaveTranId = ''
              }
            }


          }
          this.spinner.stop('check');
        }, (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('check');
        });

    }

  }

}
