import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { NgForm } from '@angular/forms';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ModalService } from 'src/app/services/modal.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-leave-accept-reject-modal',
    templateUrl: './leave-accept-reject-modal.component.html',
    styleUrls: ['./leave-accept-reject-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LeaveAcceptRejectModalComponent implements OnInit {
  advancePaymentID: any;

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('acceptModal') acceptModal;
  @ViewChild('rejectionRemarksForm') rejectionRemarksForm: NgForm;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('rejectModal') rejectModal;
  @ViewChild('closeRejectionModal') closeRejectionModal: ElementRef;

  selectedRow: any;
  rows: any;
  ipAddress: any;
  leaveAuthorizationData: any;

  LeaveType: any = [];
  values: any = [];
  leavedata: any = [];
  sandwichvalues: any = [];
  sandwichleavedata: any = [];
  leavebalance: any = [];
  // leavebutton = true;
  companyid: any;
  LeaveType1: any;
  referencedata: {};
  authdata: any;
  auth_Criteria: any;
  approvedAuthdata: any;
  apiURL = environment.apiUrl;

  optionalholiday: any = [];
  optonalHolidayDates: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private modalService: ModalService,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getIPAddress();
  }

  button(data) {
    this.advancePaymentID = data;
  }

  private getAuthorizationData(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('loader');
      this.api
        .callApi(
          this.constant.GETLEAVEAUTHORIZATIONREQUESTBYAUTHORIZATIONREQUESTID + id,
          {},
          'GET',
          false,
          false,
          true,
        )
        .subscribe(
          (res: any) => {
            if (res.data && res.data.length > 0) {
              this.leaveAuthorizationData = res.data;
              this.auth_Criteria = res.auth_Criteria?.auth_Criteria;
              this.spinner.stop('loader');
              resolve();
            } else {
              this.handleCatchError(true);
            }
          },
          (err) => {
            this.handleCatchError();
            reject(err);
          },
        );
    });
  }

  private getAuthorizationUserData(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('loader');
      this.api
        .callApi(this.constant.LEAVEAUTHREQUESTDATABYREFERANCE + id, {}, 'GET', false, false, true)
        .subscribe(
          (res: any) => {
            this.authdata = res.data;
            if (this.authdata) {
              const myData = this.authdata.filter(x => +x.userMasterID === +localStorage.getItem('id'));
              if (myData.length == 0) {
                this.router.navigateByUrl('/app');
              }
            }
            this.spinner.stop('loader');
            resolve();
          },
          (err) => {
            this.handleCatchError();
            reject(err);
          },
        );
    });
  }

  private getApprovedAuthorizationUserData(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('loader');
      this.api
        .callApi(
          this.constant.LEAVEAPRROVEDAUTHREQUESTDATABYUSERLEAVEAPPLICATIONID + id,
          {},
          'GET',
          false,
          false,
          true,
        )
        .subscribe(
          (res: any) => {
            this.approvedAuthdata = res.data;
            this.spinner.stop('loader');
            resolve();
          },
          (err) => {
            this.handleCatchError();
            reject(err);
          },
        );
    });
  }

  async alertRejectConfirmation(id: any) {
    this.referencedata = null;
    this.authdata = [];
    this.values = [];
    this.leavedata = [];
    this.sandwichvalues = [];
    this.sandwichleavedata = [];
    this.leavebalance = [];
    this.getAuthorizationData(id)
      .then(() => {
        this.processLeaveData();
      })
      .then(() => {
        this.rejectModal.show();
      })
      .catch((error) => {
        this.handleCatchError();
      });
  }

  onsubmit() {
    if (!this.accept.valid) {
      return;
    }

    let newarray = [...this.leavedata, ...this.sandwichleavedata];

    const body = {
      AuthorizationRequestId: this.leaveAuthorizationData[0].AuthorizationRequestId,
      authstatus: 1,
      ReferenceID: this.leaveAuthorizationData[0].ReferenceID,
      leavetransaction: newarray,
      createBy: localStorage.getItem('id'),
      createByip: this.ipAddress,
    };

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTLEAVE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
            }, 1000);
            this.closeModal.nativeElement.click();
            this.spinner.stop('loader');
          } else {
            this.notifications.create('Attention!', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop('loader');
          }
        },
        (err) => {
          this.handleCatchError();
        },
      );
  }

  rejectionSubmit() {
    if (!this.rejectionRemarksForm.valid) {
      return;
    }

    const body = {
      AuthorizationRequestId: this.leaveAuthorizationData
        ? this.leaveAuthorizationData[0].AuthorizationRequestId
        : '',
      authstatus: 0,
      ReferenceID: this.leaveAuthorizationData ? this.leaveAuthorizationData[0].ReferenceID : '',
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
      createByip: this.ipAddress,
      rejectionRemarks: this.rejectionRemarksForm.value.rejectionRemarks,
    };

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTLEAVE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
            }, 1000);
            this.closeRejectionModal.nativeElement.click();
            this.spinner.stop('loader');
          } else {
            this.notifications.create('Attention!', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop('loader');
          }
        },
        (err) => {
          this.handleCatchError();
        },
      );
  }
  groupedLeaveBalance: any[][] = [];
  chunkArray(arr: any[], size: number): any[][] {
    return arr.reduce(
      (acc, _, i) => (i % size ? acc[acc.length - 1].push(arr[i]) : acc.push([arr[i]]), acc),
      [],
    );
  }
  async alertAcceptConfirmation(id: any) {
    this.referencedata = null;
    this.authdata = [];
    this.values = [];
    this.leavedata = [];
    this.sandwichvalues = [];
    this.sandwichleavedata = [];
    this.leavebalance = [];
    this.getAuthorizationData(id)
      .then(() => {
        this.processLeaveData();
      })
      .then(() => {
        this.acceptModal.show();
      })
      .catch((error) => {
        this.handleCatchError();
      });
  }
  private processLeaveData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getAuthorizationUserData(this.leaveAuthorizationData[0].ReferenceID).then(() => {
        this.getApprovedAuthorizationUserData(this.leaveAuthorizationData[0].ReferenceID).then(
          () => {
            this.getOptionalHoliday(this.leaveAuthorizationData[0].userLeave.userMasterID).then(
              () => {
                this.values = [];
                this.leavedata = [];

                this.sandwichvalues = [];
                this.sandwichleavedata = [];
                this.spinner.stop('loader');
                this.getLeaveType(this.leaveAuthorizationData[0].userLeave.userMasterID);
                this.api
                  .callApi(
                    this.constant.LEAVEDETAILS +
                    this.leaveAuthorizationData[0].userLeave.UserLeaveApplicationID,
                    {},
                    'GET',
                    true,
                    true,
                    true,
                  )
                  .subscribe(
                    (res: any) => {
                      this.values = res.finaldate;

                      this.leavebalance = res.leavebalance;
                      this.groupedLeaveBalance = this.chunkArray(this.leavebalance, 4);
                      this.sandwichvalues =
                        res.sandwichdate && res.sandwichdate.length > 0 ? res.sandwichdate : [];

                      this.referencedata = {
                        DayType: res.leavedata?.DayType || '',
                        FromDate: res.leavedata?.FromDate || '',
                        ToDate: res.leavedata.ToDate || '',
                        LeaveDays: res.leavedata.LeaveDays || '',
                        Remark: res.leavedata.Remark || '',
                        PersonName: res.leavedata?.userMaster?.displayName || '',
                        userNumber: res.leavedata?.userMaster?.userNumber || '',
                        createdAt: res.leavedata?.createdAt || '',
                        employeeCode:
                          res.leavedata.userMaster?.employeeJoiningDetails[0]?.employeeCode || '',
                        branch:
                          res.leavedata.userMaster?.employeeBranches?.[0]?.branchMaster
                            ?.branchName || '',
                        department:
                          res.leavedata.userMaster?.employeeDepartments?.[0]?.department
                            ?.departmentName || '',
                        designation:
                          res.leavedata.userMaster?.employeeDesignations?.[0]?.designation
                            ?.designationName || '',
                        division:
                          res.leavedata.userMaster?.employeeDivisions?.[0]?.division
                            ?.divisionName || null,
                        workingArea:
                          res.leavedata.userMaster?.employeeWorkingAreas?.[0]?.workingArea
                            ?.workingAreaName || null,
                        appliedLeaveName: res.leavedata?.hrLeaveType?.LeaveMaster?.LeaveName || '',
                        leaveAttanchment: res.leavedata?.attachment || null,
                      };

                      let findLeaveType = this.LeaveType.find((s) => s.leaveid == 18);
                      findLeaveType = findLeaveType
                        ? findLeaveType
                        : this.LeaveType.find((s) => s.leaveid == 5);
                      const sortAuth = this.authdata
                        .filter(
                          (e) => new Date(e.createdAt).getTime() != new Date(e.updatedAt).getTime(),
                        )
                        .sort(
                          (a, b) =>
                            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
                        );
                      const latestAuth =
                        sortAuth && sortAuth.length ? sortAuth[0]?.approvedLeaveAuthorizations : [];
                      for (let i = 0; i < this.values.length; i++) {
                        let daytype = res.leavedata.DayType == 'Full Day' ? 1 : 0.5;
                        const checkOptionalHoliday = this.optonalHolidayDates.find(
                          (e) => e == this.values[i],
                        );

                        const datewiseApprovedLeave = latestAuth.length
                          ? latestAuth.filter((e) => e.date == this.values[i])
                          : [];

                        const datewiseLEaveTranID = datewiseApprovedLeave.length
                          ? datewiseApprovedLeave[0].LeaveTranId
                          : res.leavedata.LeaveTranId;
                        const datewiseLEaveTranID1 =
                          datewiseApprovedLeave.length > 1
                            ? datewiseApprovedLeave[1].LeaveTranId
                            : res.leavedata.LeaveTranId;
                        let finalLeaveTypes = checkOptionalHoliday
                          ? this.LeaveType
                          : this.LeaveType.filter((e) => e.leaveid != 24);
                        this.leavedata.push({
                          date: this.values[i],
                          LeaveTranId: Number(datewiseLEaveTranID)
                            ? Number(datewiseLEaveTranID)
                            : +findLeaveType.leavetran,
                          LeaveTranId1: Number(datewiseLEaveTranID1)
                            ? Number(datewiseLEaveTranID1)
                            : +findLeaveType.leavetran,
                          days: datewiseApprovedLeave.length
                            ? datewiseApprovedLeave[0].days
                            : daytype,
                          days1:
                            datewiseApprovedLeave.length > 1 ? datewiseApprovedLeave[1].days : 0,
                          show: daytype == 1 ? true : false,
                          issandwichleave: 0,
                          ReferenceID: Number(res.leavedata.UserLeaveApplicationID),
                          userMasterID: +this.leaveAuthorizationData[0].userLeave.userMasterID,
                          createBy: localStorage.getItem('id'),
                          createByip: this.ipAddress,
                          leaveTypes: finalLeaveTypes,
                        });
                      }

                      for (let j = 0; j < this.sandwichvalues.length; j++) {
                        let daytype = res.leavedata.DayType == 'Full Day' ? 1 : 0.5;
                        const checkOptionalHoliday = this.optonalHolidayDates.find(
                          (e) => e == this.sandwichvalues[j],
                        );

                        const datewiseApprovedLeave = latestAuth.length
                          ? latestAuth.filter((e) => e.date == this.sandwichvalues[j])
                          : [];
                        const datewiseLEaveTranID = datewiseApprovedLeave.length
                          ? datewiseApprovedLeave[0].LeaveTranId
                          : res.leavedata.LeaveTranId;
                        const datewiseLEaveTranID1 =
                          datewiseApprovedLeave.length > 1
                            ? datewiseApprovedLeave[1].LeaveTranId
                            : res.leavedata.LeaveTranId;
                        let finalLeaveTypes = checkOptionalHoliday
                          ? this.LeaveType
                          : this.LeaveType.filter((e) => e.leaveid != 24);
                        this.sandwichleavedata.push({
                          date: this.sandwichvalues[j],
                          LeaveTranId: Number(datewiseLEaveTranID)
                            ? Number(datewiseLEaveTranID)
                            : findLeaveType.leavetran,
                          LeaveTranId1: Number(datewiseLEaveTranID1)
                            ? Number(datewiseLEaveTranID1)
                            : findLeaveType.leavetran,
                          days: datewiseApprovedLeave.length
                            ? datewiseApprovedLeave[0].days
                            : daytype,
                          days1:
                            datewiseApprovedLeave.length > 1 ? datewiseApprovedLeave[1].days : 0,
                          show: daytype == 1 ? true : false,
                          issandwichleave: 1,
                          ReferenceID: Number(res.leavedata.UserLeaveApplicationID),
                          userMasterID: +this.leaveAuthorizationData[0].userLeave.userMasterID,
                          createBy: localStorage.getItem('id'),
                          createByip: this.ipAddress,
                          leaveTypes: finalLeaveTypes,
                        });
                      }

                      this.spinner.stop('loader');
                      resolve(); // Important: resolve the Promise
                    },
                    (err) => {
                      this.handleCatchError();
                      reject(err); // Important: reject on error
                    },
                  );
              },
            );
          },
        );
      });
    });
  }

  getLeaveType(userid) {
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop('loader');
          this.companyid = res.data.companyMasterId;
          let bb = {
            parameters: [+this.companyid],
          };
          this.api
            .callApi(this.constant.commonfun + '/Leavenameauth', bb, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.LeaveType = res.data;
                this.LeaveType1 = this.LeaveType.filter((e) => {
                  return e.leaveid != 18 && e.leaveid != 5;
                });
                this.spinner.stop('loader');
              }
            });
        },
        (err) => {
          this.handleCatchError();
        },
      );
  }

  getOptionalHoliday(userId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let string = `?userMasterID=${userId}`;
      this.spinner.start('check');
      this.api
        .callApi(this.constant.CHECKOPTIONALLEAVEOFUSER + string, {}, 'GET', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.optionalholiday = res.data;

              this.optonalHolidayDates = this.optionalholiday.map((e) => e.date);
            }
            resolve();
            this.spinner.stop('check');
          },
          (err) => {
            this.notifications.create('Error', err, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            reject();
            this.spinner.stop('check');
          },
        );
    });
  }

  leave(event: any, ev: any, days: any, type: any) {
    if (type == 'leave') {
      const result = this.leavedata.findIndex((s) => s.date == ev);

      this.leavedata[result].LeaveTranId = event;
      this.leavedata[result].days = days;
    } else {
      const result = this.sandwichleavedata.findIndex((s) => s.date == ev);

      this.sandwichleavedata[result].LeaveTranId = event;
      this.sandwichleavedata[result].days = days;
    }
  }

  leave1(event: any, ev: any, days: any, type: any) {
    if (type == 'leave') {
      const result = this.leavedata.findIndex((s) => s.date == ev);

      this.leavedata[result].LeaveTranId1 = event;
      this.leavedata[result].days1 = days;
    } else {
      const result = this.sandwichleavedata.findIndex((s) => s.date == ev);

      this.sandwichleavedata[result].LeaveTranId1 = event;
      this.sandwichleavedata[result].days1 = days;
    }
  }

  dayscall(event: any, date: any, tranid: any, type: any) {
    if (type == 'leave') {
      const result = this.leavedata.findIndex((s) => s.date == date);

      if (event == 1) {
        this.leavedata[result].days = event;
        this.leavedata[result].days1 = 0;
        this.leavedata[result].LeaveTranId = tranid;
      } else {
        this.leavedata[result].days = event;
        this.leavedata[result].days1 = 0.5;
      }
    } else {
      const result = this.sandwichleavedata.findIndex((s) => s.date == date);

      if (event == 1) {
        this.sandwichleavedata[result].days = event;
        this.sandwichleavedata[result].days1 = 0;
        this.sandwichleavedata[result].LeaveTranId = tranid;
      } else {
        this.sandwichleavedata[result].days = event;
        this.sandwichleavedata[result].days1 = 0.5;
      }
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  handleCatchError(customeError: boolean = false) {
    this.spinner.stop('loader');
    if (customeError) {
      this.notifications.create(
        'Warning',
        'This leave request has been updated.Please check your latest email  to approve or reject the latest version.',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 2000,
          showProgressBar: false,
        }
      );
    } else {
      this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 2000,
        showProgressBar: false,
      });
    }
  }

  view(attachment) {
    window.open(this.apiURL + 'uploads/employee-leave-attachment/' + attachment, '_blank');
  }

  showButton(authdata, leaveAuthorizationData) {
    const currentUserId = +localStorage.getItem('id');

    const status = leaveAuthorizationData?.[0]?.userLeave?.authorizationStatus;
    const checkApproval = !(status === 3 || status === 4);

    const approvedData = authdata
      ?.flatMap((auth: any) => auth.approvedLeaveAuthorizations || [])
      .filter((x: any) => +x.createdByUserDetails?.userMasterID === currentUserId) || [];

    const checkAuthData = approvedData.length === 0;

    return checkApproval && checkAuthData;
  }

}
