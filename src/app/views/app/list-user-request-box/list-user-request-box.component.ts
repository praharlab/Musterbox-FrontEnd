import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ConstantService } from 'src/app/services/constant.service';
import { ApiService } from 'src/app/services/api.service';
import { ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ModalService } from 'src/app/services/modal.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-list-user-request-box',
    templateUrl: './list-user-request-box.component.html',
    styleUrls: ['./list-user-request-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListUserRequestBoxComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows: any = {};
  message: string;
  scrollBarHorizontal = window.innerWidth < 1201;
  temp = [];
  itemsPerPage = 10;
  adminRoot = environment.adminRoot;
  filter1: string;
  columns: any;
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    type: '',
    startdate: '',
    enddate: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  query: string;

  permissionviewLeave: any = [];
  permissionviewExpense: any = [];
  permissionviewLoan: any = [];
  permissionviewAdvance: any = [];
  permissionviewGatepass: any = [];
  permissionviewEmployeeMaster: any = [];
  permissionviewCompensatoryOff: any = [];
  permissionviewExtraDays: any = [];
  permissionviewAttendanceCorrection: any = [];
  permissionviewMyTask: any = [];
  permissionviewEmployeeGatepass: any = [];
  permissionviewResignation: any = [];
  permissionviewResignationTask: any = [];
  permissionviewOutDuty: any = [];
  permissionviewShortLeave: any = [];
  permissionviewHRPreboardingRequest: any = [];
  permissionviewJobApplication: any = [];
  permissionviewUserPreboardingRequests: any = [];
  constructor(
    private constant: ConstantService,
    private api: ApiService,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.checkpermission();
    this.getData();
  }

  onSubmit() {
    if (
      !this.datefilter.value.type &&
      !this.datefilter.value.startdate &&
      !this.datefilter.value.enddate
    ) {
      return;
    }

    if (
      (this.datefilter.value.startdate && !this.datefilter.value.enddate) ||
      (!this.datefilter.value.startdate && this.datefilter.value.enddate)
    ) {
      this.commonNotificationService.handleWarning('from & to dates are required!');
      return;
    }

    this.body.page = 1;
    this.body.startdate = this.datefilter.value.startdate;
    this.body.enddate = this.datefilter.value.enddate;
    this.body.type = this.datefilter.value.type;

    this.getData();
  }

  getData() {
    let queryString = `?page=${this.body.page}&limit=${this.body.limit}`;

    if (this.body.type) {
      queryString += `&type=${this.body.type}`;
    }

    if (this.body.startdate && this.body.enddate) {
      queryString += `&startdate=${this.body.startdate}&enddate=${this.body.enddate}`;
    }

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.GETUSERINBOXDATA + queryString, {}, 'GET', false, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('loader');
          } else {
            this.commonNotificationService.handleError('Something Went Wrong!');
          }
        },
        (err) => {
          this.commonNotificationService.handleError('Something Went Wrong!');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.getData();
    } else {
      console.log('error');
    }
  }
  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

  redirectToPage(row) {
    if (row.activityTable == 'leaveAuthorizations') {
      this.router.navigate([this.adminRoot + '/attendances/leave_auth_request/2']);
    } else if (row.activityTable == 'userExpenses') {
      this.router.navigate([this.adminRoot + '/finances/expense_request']);
    } else if (row.activityTable == 'loanMasters') {
      this.router.navigate([this.adminRoot + '/finances/loanMaster']);
    } else if (row.activityTable == 'advancePayments') {
      this.router.navigate([this.adminRoot + '/finances/advancePayment']);
    } else if (row.activityTable == 'gatePasses') {
      this.router.navigate([this.adminRoot + '/gatepasses/gatepass']);
    } else if (row.activityTable == 'userExperiences') {
      this.navigateToEditPage(row.assignedBy);
    } else if (row.activityTable == 'userEducations') {
      this.navigateToEditPage(row.assignedBy);
    } else if (row.activityTable == 'userFamilies') {
      this.navigateToEditPage(row.assignedBy);
    } else if (row.activityTable == 'userDocuments') {
      this.navigateToEditPage(row.assignedBy);
    } else if (row.activityTable == 'compensatoryOffAuthorizations') {
      this.router.navigate([this.adminRoot + '/attendances/compensatoryOff-authorization']);
    } else if (row.activityTable == 'attendanceCorrectionAuthorizations') {
      this.router.navigate([this.adminRoot + '/attendances/attendance_correction_authorization']);
    } else if (row.activityTable == 'userTasks') {
      this.router.navigate([this.adminRoot + '/tasks/myTask']);
    } else if (row.activityTable == 'gatePassAuthorizations') {
      this.router.navigate([this.adminRoot + '/employeegatepasses/gatepass-authorization']);
    } else if (row.activityTable == 'resignationAuthorizations') {
      this.router.navigate([this.adminRoot + '/offboardings/resignation-approval']);
    } else if (row.activityTable == 'resignTaskAssigns') {
      this.router.navigate([this.adminRoot + '/offboardings/resignation-administration']);
    } else if (row.activityTable == 'outdoorDutyAuthorizations') {
      this.router.navigate([this.adminRoot + '/attendances/outdoor_duty_authorization']);
    } else if (row.activityTable == 'shortLeaveAuthorizations') {
      this.router.navigate([this.adminRoot + '/attendances/short-leave-authorization']);
    } else if (row.activityTable == 'extraDaysAuthorizations') {
      this.router.navigate([this.adminRoot + '/attendances/extradays-authorization']);
    } else if (row.activityTable == 'preboardings') {
      this.router.navigate([this.adminRoot + '/preboardings/hr_preboarding']);
    } else if (row.activityTable == 'jobApplications') {
      this.router.navigate([this.adminRoot + '/preboardings/jobApplication']);
    } else if (row.activityTable == 'preboardingRequests') {
      this.router.navigate([this.adminRoot + '/preboardings/user_preboarding']);
    }
  }

  navigateToEditPage(itemData: any): void {
    this.formValueStorageService.navigate(
      'ListEmployeeMasterComponent',
      {},
      '/masters/edit_employee',
      itemData,
    );
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
          //Leave
          this.permissionviewLeave = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LeaveAuthRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          // OutDoor Duty
          this.permissionviewOutDuty = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OutdoorDutyAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          //Expense
          this.permissionviewExpense = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          //Loan
          this.permissionviewLoan = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LoanMaster' && permissionval.operationName.includes('View')
            );
          });
          //Advance
          this.permissionviewAdvance = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdvancePayment' &&
              permissionval.operationName.includes('View')
            );
          });
          //Gatepass
          this.permissionviewGatepass = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GatePassEntry' &&
              permissionval.operationName.includes('View')
            );
          });
          //EmployeeMaster
          this.permissionviewEmployeeMaster = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeMaster' &&
              permissionval.operationName.includes('View')
            );
          });
          //Compensatory Off
          this.permissionviewCompensatoryOff = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CompensatoryOffAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          //Compensatory Off
          this.permissionviewExtraDays = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExtraDaysAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          //Attendance Correction
          this.permissionviewAttendanceCorrection = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AttendanceCorrectionAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          //My Task
          this.permissionviewMyTask = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyTask' && permissionval.operationName.includes('View')
            );
          });
          //Employee Gatepass
          this.permissionviewEmployeeGatepass = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeGatepassRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          //Resignation
          this.permissionviewResignation = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ResignationRequest' &&
              permissionval.operationName.includes('View')
            );
          });

          //Resignation Task
          this.permissionviewResignationTask = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ResignationTask' &&
              permissionval.operationName.includes('View')
            );
          });
          // Short Leave
          this.permissionviewShortLeave = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ShortLeaveAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          // Pre-Boarding
          this.permissionviewHRPreboardingRequest = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'HRPre-BoardingRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          // Job Application
          this.permissionviewJobApplication = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobApplication' &&
              permissionval.operationName.includes('View')
            );
          });
          // Pre-Boarding Request 
          this.permissionviewUserPreboardingRequests = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'UserPre-BoardingRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id,
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.DELETEUSERINBOX, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.commonNotificationService.handleSuccess(res.message);
            this.getData();
            this.spinner.stop('active');
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }
}
