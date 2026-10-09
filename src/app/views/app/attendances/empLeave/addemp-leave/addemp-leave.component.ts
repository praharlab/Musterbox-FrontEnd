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
    selector: 'app-addemp-leave',
    templateUrl: './addemp-leave.component.html',
    styleUrls: ['./addemp-leave.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddempLeaveComponent implements OnInit {
  @ViewChild('addEMPleave') addEMPleave: NgForm;
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
  showLeaveBalance: Boolean = false;
  leaveBalance: any = []
  totalLeaveBalance: any = 0
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
    // this.leaveTypeArray = []
    this.getIPAddress();
    this.addLeaveData();
    this.getLeaveType();
    this.getLeavePolicy();
    this.getdashboardData()

    let date = new Date();
    this.today = this.datePipe.transform(date, 'yyyy-MM-dd');
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

  selectLeaveType(id: any, i: any) {

    this.addleave[i].minLeaveAttachment = null

    if (!id) return;
    // get selectedLeave Type
    const currentLeaveType = this.LeaveType.find(e => e.leavetran == id);

    if (!currentLeaveType || !this.employeeLeavePolicy) return;
    //  get leave Policy of  selectedLeave Type
    const leavePolicy = this.employeeLeavePolicy.leavePolicy.find(e => e.leaveId == currentLeaveType.leaveid);

    if (leavePolicy && +leavePolicy.min_leave_attachment > 0) this.addleave[i].minLeaveAttachment = +leavePolicy.min_leave_attachment;

  }

  getLeaveType() {
    this.leaveTypeArray = []
    let bb = {
      parameters: [+localStorage.getItem('company_id')],
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.commonfun + '/GetLeavesName', bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allLeaveType = [...res.data];
          this.LeaveType = res.data.filter(e => e.leaveid != 24);
          this.leaveTypeArray.push(this.LeaveType)

          this.spinner.stop();
        }
      });
  }

  addLeaveData() {
    this.addleave.push({
      leaveType: '',
      dayType: '',
      from: '',
      to: '',
      days: '',
      remark: '',
      visible: false,
      deleted: false,
      attachment: '',
      minLeaveAttachment: null
    });
    this.leaveTypeArray.push(this.LeaveType)
  }

  onFileChange(event: any, i) {

    this.image = null

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    else this.image = null

    this.addleave[i].attachment = this.image


  }

  changeDay() {

    const datelist = [];
    this.addleave.forEach((element) => {
      if (element.dayType == 'First Half') {
        element.visible = false;
        if (element.from != '') {
          element.days = 0.5;
          element.to = element.from;
          if (!element.deleted) {
            datelist.push({date:element.from,dayType:element.dayType});
          }

        }
      } else if (element.dayType == 'Second Half') {
        element.visible = false;
        if (element.from != '') {
          element.days = 0.5;
          element.to = element.from;

          if (!element.deleted) {
            datelist.push({date:element.from,dayType:element.dayType});
          }

        }
      } else {
        element.visible = true;
        if (element.from != '' && element.to != '') {
          let fdate = new Date(element.from).getTime();
          let tdate = new Date(element.to).getTime();
          // element.days= ((tdate-fdate)/86400000) + 1;
          element.days = (tdate - fdate) / (1000 * 3600 * 24) + 1;
          if (element.days != '1' && element.days != 1) {
            var newDate = element.from;
            while (newDate <= element.to) {
              if (!element.deleted) {
                datelist.push({date:newDate,dayType:element.dayType});
              }

              let date = new Date(newDate);
              date.setDate(date.getDate() + 1);
              newDate = this.datePipe.transform(date, 'yyyy-MM-dd');

            }
          } else {
            if (!element.deleted) {
              datelist.push({date:element.from,dayType:element.dayType});
            }

          }
        }
      }
    
      const duplicatedate = datelist.some((entry, index) => {
        return datelist.findIndex((e, i) => {
          if (entry.dayType === "Full Day") {
            // If dayType is "Full Day", only check for duplicate dates
            return e.date === entry.date && i !== index;
          } else {
            // For other dayTypes, check for both date and dayType duplicates
            return e.date === entry.date && e.dayType === entry.dayType && i !== index;
          }
        }) !== -1;
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
    });

  }

  removeLeave(i: number) {

    this.addleave[i].deleted = true;
    this.changeDay()
  }

  onSubmit() {

    if (!this.addEMPleave.valid) return

    this.addleave = this.addleave.filter(e => !e.deleted);

    const formData = new FormData();
    this.addleave.forEach((element, index) => {
      if (element.leaveType != '') {
        formData.append(`LeaveTranId${index}`, element.leaveType);
        formData.append(`userMasterID${index}`, localStorage.getItem('id'));
        formData.append(`FromDate${index}`, element.from);
        formData.append(`ToDate${index}`, element.to);
        formData.append(`companyMasterID${index}`, localStorage.getItem('company_id'));
        formData.append(`LeaveDays${index}`, element.days);

        formData.append(`Remark${index}`, element.remark);
        formData.append(`DayType${index}`, element.dayType);
        formData.append(`Authorization${index}`, '0');
        formData.append(`isattachment${index}`, element.attachment ? 'yes' : 'no');

        formData.append(`attachment`, element.attachment);
        formData.append(`createByIp${index}`, this.ipAddress);
        formData.append(`leaveFrom${index}`, 'employee');
      }
    });


    this.api.callApi(this.constant.ADDUSERLEAVE_WEB, formData, 'POST', true, true, true).subscribe(
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
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.isdisabled = false;
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
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

  checkOptionalLeave(i: any) {

    const optionalLeave = this.allLeaveType.find(e => e.leaveid == 24);
    if (!optionalLeave) return
    // if from date is null 
    if (!this.addleave[i].from) {
      this.leaveTypeArray[i] = this.LeaveType;
      if (this.addleave[i].leaveType == optionalLeave.leavetran) {
        this.addleave[i].leaveType = ''
      }
    }

    const leaveData = this.addleave[i]

    let string = `?userMasterID=${localStorage.getItem('id')}`
    if (leaveData.from && leaveData.to) {

      string += `&startDate=${leaveData.from}&endDate=${leaveData.to}`

      this.spinner.start('check');
      this.api
        .callApi(this.constant.CHECKOPTIONALLEAVEOFUSER + string, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.optionalholiday = res.data;

            this.optionalholidayArray[i] = this.optionalholiday.map(e => e.date);



            if (this.optionalholidayArray[i].length > 0 && leaveData.from == leaveData.to) {



              this.leaveTypeArray[i] = this.allLeaveType;
            } else {
              this.leaveTypeArray[i] = this.LeaveType;
              if (this.addleave[i].leaveType == optionalLeave.leavetran) {
                this.addleave[i].leaveType = ''
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

  getdashboardData() {
    const id = localStorage.getItem('company_id');
    const userid = localStorage.getItem('id');

    if (id && userid) {
      const queryString = `?companyMasterID=${id}&userMasterID=${userid}`;

      this.spinner.start('oninit');
      this.api
        .callApi(this.constant.GETUSERLEAVEBALANCE + queryString, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.leaveBalance = res.data;
            this.showLeaveBalance = true;

            this.totalLeaveBalance = this.leaveBalance.reduce((sum, leave) => sum + leave.Balance, 0);

            this.spinner.stop('oninit');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit');
          }
        },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('oninit');
          },
        );
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
