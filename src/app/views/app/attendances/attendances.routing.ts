import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendancemasterComponent } from './attendancemaster/attendancemaster.component';
import { AttendancesComponent } from './attendances.component';
import { EmployeeAttendanceCalendarComponent } from './employee-attendance-calendar/employee-attendance-calendar.component';
import { SingleEmployeeAttendanceListComponent } from './single-employee-attendance-list/single-employee-attendance-list.component';
import { CompanyLeaveDataComponent } from './company-leave-data/company-leave-data.component';
import { ListBiometricUserComponent } from './biometric-User/list-biometric-user/list-biometric-user.component';
import { AddBiometricUserComponent } from './biometric-User/add-biometric-user/add-biometric-user.component';
import { EditBiometricUserComponent } from './biometric-User/edit-biometric-user/edit-biometric-user.component';

const routes: Routes = [
  {
    path: '',
    component: AttendancesComponent,
    children: [
      { path: '', redirectTo: 'attendance_master', pathMatch: 'full' },
      { path: 'attendance_master', component: AttendancemasterComponent },

      {
        path: 'attendance',
        loadChildren: () =>
          import('./attendance/attendance-master.module').then((m) => m.AttendanceMasterModule),
      },

      {
        path: 'myattendance-summary',
        loadChildren: () =>
          import('./myattendance-summary/attendance-summary-master.module').then(
            (m) => m.AttendanceSummaryMasterModule,
          ),
      },

      {
        path: 'employeeLeave',
        loadChildren: () =>
          import('./empLeave/emp-leave-master.module').then((m) => m.EmpLeaveMasterModule),
      },

      {
        path: 'my_leave_balance',
        loadChildren: () =>
          import('./my-leave-balance/leave-balance-master.module').then(
            (m) => m.LeaveBalanceMasterModule,
          ),
      },

      {
        path: 'My-Outside-Attendance',
        loadChildren: () =>
          import('./my-outside-attendance/outside-attendance-master.module').then(
            (m) => m.OutsideAttendanceMasterModule,
          ),
      },

      {
        path: 'Team-Outside-Attendance',
        loadChildren: () =>
          import('./team-outside-attendance/team-outside-attendance-master.module').then(
            (m) => m.TeamOutsideAttendanceMasterModule,
          ),
      },

      {
        path: 'leave_auth_request/:id',
        loadChildren: () =>
          import('./leave-authrequest/leave-auth-request-master.module').then(
            (m) => m.LeaveAuthRequestMasterModule,
          ),
      },

      {
        path: 'employee-attendance-list',
        loadChildren: () =>
          import('./employee-attendance-list/employee-attendance-master.module').then(
            (m) => m.EmployeeAttendanceMasterModule,
          ),
      },

      {
        path: 'mannual-attendance',
        loadChildren: () =>
          import('./mannual-attendance/manual-attendance-master.module').then(
            (m) => m.ManualAttendanceMasterModule,
          ),
      },

      {
        path: 'biometeic_attendance_sync',
        loadChildren: () =>
          import('./biometric-attendance-sync/biometric-attendance-sync-master.module').then(
            (m) => m.BiometricAttendanceSyncMasterModule,
          ),
      },

      {
        path: 'upload-attendance',
        loadChildren: () =>
          import('./upload-attendance/upload-attendance-master.module').then(
            (m) => m.UploadAttendanceMasterModule,
          ),
      },

      {
        path: 'addmanual-leave',
        loadChildren: () =>
          import('./addmanual-leave/manual-leave-master.module').then(
            (m) => m.ManualLeaveMasterModule,
          ),
      },

      {
        path: 'leave_cancel',
        loadChildren: () =>
          import('./leavecancel/leave-cancel-master.module').then((m) => m.LeaveCancelMasterModule),
      },

      {
        path: 'ValidateShiftAttendance',
        loadChildren: () =>
          import('./validate-shift-attendance/validate-shift-attendance-master.module').then(
            (m) => m.ValidateShiftAttendanceMasterModule,
          ),
      },

      // { path: 'employee-attendance-calendar', component: EmployeeAttendanceCalendarComponent },
      {
        path: 'employee-attendance-calendar',
        loadChildren: () =>
          import('./employee-attendance-calendar/emp-attendance-calendar-master.module').then(
            (m) => m.EmpAttendanceCalendarMasterModule,
          ),
      },

      { path: 'single-employee-attendance-list', component: SingleEmployeeAttendanceListComponent },

      {
        path: 'pending_Biometric_Sync',
        loadChildren: () =>
          import('./pending-biomertic-sync/pending-biometric-sync-master.module').then(
            (m) => m.PendingBiometricSyncMasterModule,
          ),
      },

      {
        path: 'biometric_list',
        loadChildren: () =>
          import('./biometric-list/biometric-list-master.module').then(
            (m) => m.BiometricListMasterModule,
          ),
      },

      { path: 'leavedata_show', component: CompanyLeaveDataComponent },
      {
        path: 'compensatoryOff-authorization',
        loadChildren: () =>
          import(
            './compensatory-off-authorization-request/coff-authorization-request-master.module'
          ).then((m) => m.CoffAuthorizationRequestMasterModule),
      },

      {
        path: 'my-compensatoryOff',
        loadChildren: () =>
          import('./my-compensatory-off/compensatory-off-master.module').then(
            (m) => m.CompensatoryOffMasterModule,
          ),
      },

      { path: 'list-biometricUser', component: ListBiometricUserComponent },
      { path: 'add-biometricUser', component: AddBiometricUserComponent },
      { path: 'edit-biometricUser', component: EditBiometricUserComponent },

      {
        path: 'list_attendance_correction_request',
        loadChildren: () =>
          import('./attendance-correction/attendance-correction-master.module').then(
            (m) => m.AttendanceCorrectionMasterModule,
          ),
      },

      {
        path: 'attendance_correction_authorization',
        loadChildren: () =>
          import(
            './attendance-correction-authorization/attendance-correction-authorization-master-routing.module'
          ).then((m) => m.AttendanceCorrectionAuthorizationMasterRoutingModule),
      },

      {
        path: 'shiftRoster',
        loadChildren: () =>
          import('./shift-roster/shift-roster-master.module').then(
            (m) => m.ShiftRosterMasterModule,
          ),
      },

      {
        path: 'reporteeWiseShiftRoster',
        loadChildren: () =>
          import('./reportee-wise-shift-roster/report-wise-shift-roster-master.module').then(
            (m) => m.ReportWiseShiftRosterMasterModule,
          ),
      },

      {
        path: 'my_Outdoor_Duty',
        loadChildren: () =>
          import('./my-outdoor-duty/outdoor-duty-master.module').then(
            (m) => m.OutdoorDutyMasterModule,
          ),
      },

      {
        path: 'outdoor_duty_authorization',
        loadChildren: () =>
          import('./outdoor-duty-authorization/outdoor-duty-authorization-master.module').then(
            (m) => m.OutdoorDutyAuthorizationMasterModule,
          ),
      },

      {
        path: 'outdoor_duty_cancellation',
        loadChildren: () =>
          import('./outdoor-duty-cancellation/outdoor-duty-cancel-master.module').then(
            (m) => m.OutdoorDutyCancelMasterModule,
          ),
      },

      {
        path: 'upload-biometric-attendance',
        loadChildren: () =>
          import('./upload-biometric-attendance/upload-biometric-attendance-master.module').then(
            (m) => m.UploadBiometricAttendanceMasterModule,
          ),
      },

      {
        path: 'short_leave_cancellation',
        loadChildren: () =>
          import('./short-leave-cancellation/short-leave-cancellation-master.module').then(
            (m) => m.ShortLeaveCancellationMasterModule,
          ),
      },
      // { path: 'short_leave_cancellation', component: ShortLeaveCancellationComponent },

      {
        path: 'my-short-leave-application',
        loadChildren: () =>
          import('./my-short-leave-application/short-leave-application-master.module').then(
            (m) => m.ShortLeaveApplicationMasterModule,
          ),
      },
      {
        path: 'bulk-short-leave-application',
        loadChildren: () =>
          import('./bulk-short-leave-application/bulk-short-leave-application.module').then(
            (m) => m.BulkShortLeaveApplicationModule,
          ),
      },
      {
        path: 'short-leave-authorization',
        loadChildren: () =>
          import('./short-leave-authorization/short-leave-authorization.module').then(
            (m) => m.ShortLeaveAuthorizationModule,
          ),
      },

      {
        path: 'extradays-authorization',
        loadChildren: () =>
          import('./extra-days-authorization-master/extra-days-authorization-master.module').then(
            (m) => m.ExtraDaysAUthorizationMasterModule,
          ),
      },
      {
        path: 'my-extraDays',
        loadChildren: () =>
          import('./my-extra-days/my-extra-days.module').then((m) => m.MyExtraDaysModule),
      },
      {
        path: 'adminOutdoorDuty',
        loadChildren: () =>
          import('./admin-outdoor-duty/admin-outdoor-duty.module').then(
            (m) => m.AdminOutdoorDutyModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendancesRoutingModule {}
