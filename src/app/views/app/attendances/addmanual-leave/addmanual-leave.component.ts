import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-addmanual-leave',
    templateUrl: './addmanual-leave.component.html',
    styleUrls: ['./addmanual-leave.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddmanualLeaveComponent implements OnInit {

  @Input('showImport') showImport = true
  @Input('showCancel') showCancel = true

  permissioncreate: any;
  permissionedit: any;
  permissionview: any;
  permissiondelete: any;
  adminRoot = environment.adminRoot;


  @ViewChild('datefilter') datefilter: NgForm;
  isdisabled = false;
  ipAddress: any;

  public addleave: any = [];
  toda: boolean = false;
  index: any;
  LeaveType: any;
  today: any;
  company1: any;
  company_id: string;
  usertype: string;
  empList: any;
  allbranch: any;
  optionalholiday: any = [];
  optionalholidayArray: any = [];
  leaveTypeArray: any = []
  allLeaveType: any = [];
  image: any;
  datelist: any = [];
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
    this.getIPAddress();
    this.addLeaveData();
    // this.getLeaveType();
    // let date = new Date()
    // this.today = this.datePipe.transform(date, 'yyyy-MM-dd')
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    if (id == undefined) {
      window.location.reload();
    } else {
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
        });

      const filterData = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.empList = res.data;
          }
        });

      this.getLeaveType();
    }
  }

  selectbranch(id) {
    const filterData = {
      branchMasterID: id,
    };
    if (id != '' && id != null) {
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.empList = res.data;

            this.spinner.stop();
          }
        });
    } else {
      const filterData = {
        page: '',
        limit: '',
        companyMasterID: this.datefilter.value.company,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.empList = res.data;
          }
        });
    }
  }

  getLeaveType() {
    this.leaveTypeArray = []
    let bb = {
      parameters: [+this.datefilter.value.company],
    };
    this.spinner.start('getLeaveType');
    this.api
      .callApi(this.constant.commonfun + '/GetLeavesName', bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allLeaveType = [...res.data];
          this.LeaveType = res.data.filter(e => e.leaveid != 24);
          this.leaveTypeArray.push(this.LeaveType)


          this.spinner.stop('getLeaveType');
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
      attachment: ''
    });
    this.leaveTypeArray.push(this.LeaveType)
  }

  changeDay() {
    this.datelist = [];

    this.addleave.forEach((element) => {
      if (element.dayType == 'First Half') {
        element.visible = false;
        if (element.from != '') {
          element.days = 0.5;
          element.to = element.from;
          if (!element.deleted) {
            this.datelist.push({ date: element.from, dayType: element.dayType });
          }
        }
      } else if (element.dayType == 'Second Half') {
        element.visible = false;
        if (element.from != '') {
          element.days = 0.5;
          element.to = element.from;

          if (!element.deleted) {
            this.datelist.push({ date: element.from, dayType: element.dayType });
          }

        }
      } else {
        element.visible = true;
        if (element.from != '' && element.to != '') {
          let fdate = new Date(element.from).getTime();
          let tdate = new Date(element.to).getTime();

          element.days = (tdate - fdate) / (1000 * 3600 * 24) + 1;
          if (element.days != '1' && element.days != 1) {
            var newDate = element.from;
            while (newDate <= element.to) {
              if (!element.deleted) {
                this.datelist.push({ date: newDate, dayType: element.dayType });
              }

              let date = new Date(newDate);
              date.setDate(date.getDate() + 1);
              newDate = this.datePipe.transform(date, 'yyyy-MM-dd');
            }
          } else {
            if (!element.deleted) {
              this.datelist.push({ date: element.from, dayType: element.dayType });
            }

          }
        }
      }

      const duplicatedate = this.datelist.some((entry, index) => {
        return this.datelist.findIndex((e, i) => {
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

  onFileChange(event: any, i) {

    this.image = null

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    else this.image = null

    this.addleave[i].attachment = this.image

  }


  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.addleave = this.addleave.filter(e => !e.deleted);

    const formData = new FormData();
    this.addleave.forEach((element, index) => {
      if (element.leaveType != '') {
        formData.append(`LeaveTranId${index}`, element.leaveType);
        formData.append(`userMasterID${index}`, this.datefilter.value.employee);
        formData.append(`FromDate${index}`, element.from);
        formData.append(`ToDate${index}`, element.to);
        formData.append(`companyMasterID${index}`, this.datefilter.value.company);
        formData.append(`LeaveDays${index}`, element.days);

        formData.append(`Remark${index}`, element.remark);
        formData.append(`DayType${index}`, element.dayType);
        formData.append(`Authorization${index}`, '0');
        formData.append(`isattachment${index}`, element.attachment ? 'yes' : 'no');

        formData.append(`attachment`, element.attachment);
        formData.append(`createByIp${index}`, this.ipAddress);
        formData.append(`leaveFrom${index}`, 'manual');
      }
    });

    // this.addleave.forEach((element) => {
    //   if (element.leaveType != '') {
    //     body.push({
    //       LeaveTranId: element.leaveType,
    //       userMasterID: this.datefilter.value.employee,
    //       companyMasterID: this.datefilter.value.company,
    //       FromDate: element.from,
    //       ToDate: element.to,
    //       LeaveDays: element.days,
    //       Remark: element.remark,
    //       DayType: element.dayType,
    //       Authorization: 0,
    //       status: 1,
    //       createBy: localStorage.getItem('id'),
    //       createByIp: this.ipAddress,
    //     });
    //   }
    // });

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
            // this.router.navigate(['app/employeeLeave'])
            window.location.reload();
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

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AddManualLeave' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AddManualLeave' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AddManualLeave' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AddManualLeave' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
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

    let string = `?userMasterID=${this.datefilter.value.employee}`
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

  showLeaveBalance: Boolean = false;
  leaveBalance: any = []
  totalLeaveBalance: any = 0
  changeUser(userMasterID) {
    this.leaveBalance = [];
    this.showLeaveBalance = false;
    this.totalLeaveBalance = 0
    if (!this.datefilter.value.company || !userMasterID) return
    const queryString = `?companyMasterID=${this.datefilter.value.company}&userMasterID=${userMasterID}`;

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
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
