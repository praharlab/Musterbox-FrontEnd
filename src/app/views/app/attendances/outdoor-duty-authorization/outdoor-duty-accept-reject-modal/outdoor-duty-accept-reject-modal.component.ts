import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { NgForm } from '@angular/forms';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-outdoor-duty-accept-reject-modal',
    templateUrl: './outdoor-duty-accept-reject-modal.component.html',
    styleUrls: ['./outdoor-duty-accept-reject-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OutdoorDutyAcceptRejectModalComponent implements OnInit {
  advancePaymentID: any;

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('acceptModal') acceptModal;
  @ViewChild('rejectModal') rejectModal;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;

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
  leavebutton = true;
  companyid: any;
  LeaveType1: any;
  referencedata: {};
  authdata: any;
  auth_Criteria: any;

  optionalholiday: any = [];
  optonalHolidayDates: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {}

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
    this.auth_Criteria = null;
    this.authdata = [];
    this.getAuthorizationData(id)
      .then(() => {
        this.processLeaveData();
        this.rejectModal.show();
      })
      .catch((error) => {
        this.handleCatchError();
        this.spinner.stop('loader');
      });
  }

  onAcceptSubmit() {
    if (!this.accept.valid) {
      return;
    }

    const body = {
      AuthorizationRequestId: this.leaveAuthorizationData[0].AuthorizationRequestId,
      authstatus: 1,
    };

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.ACCEPTREJECTOUTDOORDUTY, body, 'POST', true, true, true)
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
          this.spinner.stop('loader');
        },
      );
  }

  async alertAcceptConfirmation(id: any) {
    this.referencedata = null;
    this.auth_Criteria = null;
    this.authdata = [];
    this.getAuthorizationData(id)
      .then(() => {
        this.processLeaveData();
        this.acceptModal.show();
      })
      .catch((error) => {
        this.handleCatchError();
        this.spinner.stop('loader');
      });
  }

  handleCatchError(customeError: boolean = false) {
    this.spinner.stop('loader');
    if (customeError) {
      this.notifications.create(
        'Warning',
        'This request has been updated.Please check and try again later',
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

  private processLeaveData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getAuthorizationUserData(this.leaveAuthorizationData[0].ReferenceID).then(() => {
        this.spinner.stop('loader');
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
              this.referencedata = {
                DayType: res.leavedata.DayType || '',
                FromDate: res.leavedata.FromDate || '',
                ToDate: res.leavedata.ToDate || '',
                LeaveDays: res.leavedata.LeaveDays || '',
                Remark: res.leavedata.Remark || '',
                PersonName: res.leavedata.userMaster.displayName || '',
                createdAt: res.leavedata.createdAt || '',
                userNumber: res.leavedata?.userMaster?.userNumber || '',

                employeeCode:
                  res.leavedata.userMaster?.employeeJoiningDetails[0]?.employeeCode || '',
                branch:
                  res.leavedata.userMaster?.employeeBranches?.[0]?.branchMaster?.branchName || '',
                department:
                  res.leavedata.userMaster?.employeeDepartments?.[0]?.department?.departmentName ||
                  '',
                designation:
                  res.leavedata.userMaster?.employeeDesignations?.[0]?.designation
                    ?.designationName || '',
                division:
                  res.leavedata.userMaster?.employeeDivisions?.[0]?.division?.divisionName || null,
                workingArea:
                  res.leavedata.userMaster?.employeeWorkingAreas?.[0]?.workingArea
                    ?.workingAreaName || null,
              };

              this.spinner.stop('loader');
              resolve(); // Important: resolve the Promise
            },
            (err) => {
              this.handleCatchError();
              reject(err); // Important: reject on error
              this.spinner.stop('loader');
            },
          );
      });
    });
  }

  onRejectSubmit() {
    if (!this.accept.valid) {
      return;
    }
    const body = {
      AuthorizationRequestId: this.leaveAuthorizationData
        ? this.leaveAuthorizationData[0].AuthorizationRequestId
        : '',
      authstatus: 0,
      rejectionRemarks: this.reject.value.rejectionRemarks,
    };
    this.spinner.start('loader');
    this.api
      .callApi(this.constant.ACCEPTREJECTOUTDOORDUTY, body, 'POST', true, true, true)
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
            this.closeModal1.nativeElement.click();
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
          this.spinner.stop('loader');
        },
      );
  }
}
