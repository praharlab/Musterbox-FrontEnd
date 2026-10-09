import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-attendancemaster',
    templateUrl: './attendancemaster.component.html',
    styleUrls: ['./attendancemaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AttendancemasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  AttendanceArray: any = [];
  MyAttendanceArray: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.MyAttendanceArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'My Attendance',
        menu: 'Attendance',
        to: `${this.adminRoot}/attendances/attendance`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My Attendance Summary',
        menu: 'MyAttendanceSummary',
        to: `${this.adminRoot}/attendances/myattendance-summary`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'My Leave Application',
        menu: 'LeaveApplication',
        to: `${this.adminRoot}/attendances/employeeLeave`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My Leave Balance',
        menu: 'MyLeaveBalance',
        to: `${this.adminRoot}/attendances/my_leave_balance`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'My OutSide Attendance',
        menu: 'MyOutsideAttendance',
        to: `${this.adminRoot}/attendances/My-Outside-Attendance`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'My Compensatory Off',
        menu: 'MyCompensatoryOff',
        to: `${this.adminRoot}/attendances/my-compensatoryOff`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'My Outdoor Duty',
        menu: 'MyOutdoorDuty',
        to: `${this.adminRoot}/attendances/my_Outdoor_Duty`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'My Short Leave Application',
        menu: 'MyShortLeaveApplication',
        to: `${this.adminRoot}/attendances/my-short-leave-application`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My Extra Days',
        menu: 'MyExtraDays',
        to: `${this.adminRoot}/attendances/my-extraDays`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Bulk Short Leave Application',
        menu: 'BulkShortLeaveApplication',
        to: `${this.adminRoot}/attendances/bulk-short-leave-application`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Team OutSide Attendance',
        menu: 'TeamOutsideAttendancePermission',
        to: `${this.adminRoot}/attendances/Team-Outside-Attendance`,
      },

      {
        icon: 'iconsminds-calendar-4',
        label: 'Leave Authorization',
        menu: 'LeaveAuthRequest',
        to: `${this.adminRoot}/attendances/leave_auth_request/2`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Compensatory Off Authorization',
        menu: 'CompensatoryOffAuthorization',
        to: `${this.adminRoot}/attendances/compensatoryOff-authorization`,
      },

      {
        icon: 'iconsminds-calendar-4',
        label: 'Daily Attendance',
        menu: 'DailyAttendance',
        to: `${this.adminRoot}/attendances/employee-attendance-list`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Attendance Correction Request',
        menu: 'AttendanceCorrectionRequest',
        to: `${this.adminRoot}/attendances/list_attendance_correction_request`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Attendance Correction Authorization ',
        menu: 'AttendanceCorrectionAuthorization',
        to: `${this.adminRoot}/attendances/attendance_correction_authorization`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Outdoor Duty Authorization',
        menu: 'OutdoorDutyAuthorization',
        to: `${this.adminRoot}/attendances/outdoor_duty_authorization`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Short Leave Authorization',
        menu: 'ShortLeaveAuthorization',
        to: `${this.adminRoot}/attendances/short-leave-authorization`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Extra Days Authorization',
        menu: 'ExtraDaysAuthorization',
        to: `${this.adminRoot}/attendances/extradays-authorization`,
      },
    ];

    this.AttendanceArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'Manual Attendance',
        menu: 'ManualAttendance',
        to: `${this.adminRoot}/attendances/mannual-attendance`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Biometric Attendance',
        menu: 'BiometricAttendance',
        to: `${this.adminRoot}/attendances/biometeic_attendance_sync`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Pending Biometric Attendance',
        menu: 'BiometricAttendance',
        to: `${this.adminRoot}/attendances/pending_Biometric_Sync`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Upload Biometric Attendance',
        menu: 'BiometricAttendance',
        to: `${this.adminRoot}/attendances/upload-biometric-attendance`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Biometric List',
        menu: 'Biometric',
        to: `${this.adminRoot}/attendances/biometric_list`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Upload Attendance',
        menu: 'ExcelAttendance',
        to: `${this.adminRoot}/attendances/upload-attendance`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: ' Add Manual Leave',
        menu: 'AddManualLeave',
        to: `${this.adminRoot}/attendances/addmanual-leave`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Leave Cancellation',
        menu: 'LeaveCancellation',
        to: `${this.adminRoot}/attendances/leave_cancel`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Admin Outdoor Duty',
        menu: 'AdminOutdoorDuty',
        to: `${this.adminRoot}/attendances/adminOutdoorDuty`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Outdoor Duty Cancellation',
        menu: 'OutdoorDutyCancellation',
        to: `${this.adminRoot}/attendances/outdoor_duty_cancellation`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Short Leave Cancellation',
        menu: 'ShortLeaveCancellation',
        to: `${this.adminRoot}/attendances/short_leave_cancellation`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Shift Validate',
        menu: 'ShiftValidate',
        to: `${this.adminRoot}/attendances/ValidateShiftAttendance`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'Shift Roster',
        menu: 'ShiftRoster',
        to: `${this.adminRoot}/attendances/shiftRoster`,
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'ReporteeWise Shift Roster',
        menu: 'ReporteeWiseShiftRoster',
        to: `${this.adminRoot}/attendances/reporteeWiseShiftRoster`,
      },
    ];
  }
}
