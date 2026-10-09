import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AttendaceCalendarComponent } from 'src/app/containers/dashboards/attendace-calendar/attendace-calendar.component';

@Component({
    selector: 'app-employee-attendance-calendar',
    templateUrl: './employee-attendance-calendar.component.html',
    styleUrls: ['./employee-attendance-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeAttendanceCalendarComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(AttendaceCalendarComponent) AttendaceCalendarComponent: AttendaceCalendarComponent;
  permissioncreate: any = [];
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: '',
  };
  employee: any;
  alldepartment: any[];
  alldesignation: any[];
  allbranch: any[];
  allDivision: any[];
  allWorkingArea: any[];
  selectedbranch: null;
  selecteddept: null;
  selecteddesig: null;
  selectedDivision: null;
  selectedWorkingArea: null;
  selectedEmployees: any[];
  company1: any;
  company_id: string;
  UserID: number;
  selectedMonth: any;
  formValue: any;
  CompanyID: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.checkpermission();
    this.formValue = this.formValueStorageService.getData();

    this.selectcompany(this.formValue.EmployeeAttendanceListComponent.body.companyid);

    this.CompanyID = +this.formValue.EmployeeAttendanceListComponent.body.companyid;
    this.UserID = +this.formValue.EmployeeAttendanceListComponent.id;

    // this.getcompany();
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
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LeaveApplication' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  // getcompany() {
  //   const body = {
  //     companyMasterID: localStorage.getItem('company_id'),
  //   };
  //   this.spinner.start('company');
  //   this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
  //     (res: any) => {
  //       if (res.status == 200) {
  //         this.company1 = res.data;
  //         this.spinner.stop('company');
  //       } else {
  //         this.handleError(res.message);
  //         this.spinner.stop('company');
  //       }
  //     },
  //     (err) => {
  //       this.handleError(err.error.message);
  //       this.spinner.stop('company');
  //     },
  //   );
  // }

  // private handleError(message: any) {
  //   this.notifications.create('Error', message, NotificationType.Error, {
  //     theClass: 'outline primary',
  //     timeOut: 3000,
  //     showProgressBar: false,
  //   });
  // }

  getUsers() {
    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          // this.selectAllForDropdownItems(this.employee);
        }
        this.spinner.stop('users');
      });
  }

  selectcompany(id) {
    this.alldepartment = [];
    this.alldesignation = [];
    this.allbranch = [];
    this.allDivision = [];
    this.allWorkingArea = [];

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;

    if (!id) return;
    this.spinner.start('depart');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          // this.filter = 'filt'

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('depart');
        }
      });

    // getDesignationData() {}
    this.spinner.start('desig');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('desig');
        }
      });

    this.spinner.start('branch');

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('branch');
      });

    this.spinner.start('workingArea');
    this.api
      .callApi(
        this.constant.LISTWORKINGAREA + '?companyMasterID=' + id + '&status=1',
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('workingArea');
      });

    this.spinner.start('Division');
    this.api
      .callApi(
        this.constant.LISTDIVISION + '?companyMasterID=' + id + '&status=1',
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allDivision = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('Division');
      });

    this.users_Body.companyMasterID = id;
    this.getUsers();
  }

  selectbranch(id) {
    this.employee = [];
    this.UserID = null;
    this.users_Body.branchMasterID = id;
    this.getUsers();
  }

  selectdepart(id) {
    this.employee = [];
    this.UserID = null;
    this.users_Body.departmentID = id;
    this.getUsers();
  }

  selectdesig(id) {
    this.employee = [];
    this.UserID = null;
    this.users_Body.designationID = id;
    this.getUsers();
  }

  selectdivision(id) {
    this.employee = [];
    this.UserID = null;
    this.users_Body.divisionId = id;
    this.getUsers();
  }

  selectWorkingArea(id) {
    this.employee = [];
    this.UserID = null;
    this.users_Body.workingAreaId = id;
    this.getUsers();
  }

  onSubmit(id) {
    if (!id) {
      this.UserID = null;
      return;
    }
    this.UserID = +id;
    let userid = +id;

    if (userid) {
      if (!this.datefilter.valid || !this.AttendaceCalendarComponent) return;

      this.AttendaceCalendarComponent.id = this.UserID;
      this.spinner.start('submit');
      this.AttendaceCalendarComponent.onSubmit();
      this.spinner.stop('submit');
    }
  }
}
