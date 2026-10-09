import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-add-attendance-correction-request',
    templateUrl: './add-attendance-correction-request.component.html',
    styleUrls: ['./add-attendance-correction-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAttendanceCorrectionRequestComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;

  radiostatus: string = '1';
  adminRoot = environment.adminRoot;

  log1: any[] = [];
  todayDate: any;
  values = [];
  attendanceDate: string;
  attendanceStatus: string;
  ipAddress: any;
  currentDate: string;
  tomorrowDate: string;

  originalLogs: any[] = [];

  attendanceLogs: any = [];
  dateTimeErrors: boolean[] = [];
  disabledFields: Set<number> = new Set();

  inLogDateTime: any;
  outLogDateTime: any;
  isDisabled: true;
  minDate: string;
  maxDate: string;

  fullDayHalfDay: any;
  allshift: any;
  selectedShift: any;
  InTimeChage: boolean = false;
  OutTimeChage: boolean = false;

  reasons: any;
  selectedReason: any;
  findDefaultReason: any;
  showRemark: boolean = true;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    this.minDate = `${previousMonth.getFullYear()}-${('0' + (previousMonth.getMonth() + 1)).slice(
      -2,
    )}-${('0' + previousMonth.getDate()).slice(-2)}`;

    this.maxDate = this.todayDate;

    this.tomorrowDate = this.getTomorrowDate(this.todayDate);
    this.getIPAddress();
    this.getShift();
    this.getAttendanceCorrectionReasons();
  }

  getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getTomorrowDate(date: string): string {
    const selectedDate = new Date(date);
    selectedDate.setDate(selectedDate.getDate() + 1);
    return this.getFormattedDate(selectedDate);
  }

  onAttendanceDateChange(newDate: string) {
    this.currentDate = newDate;
    this.tomorrowDate = this.getTomorrowDate(newDate);
    this.values = [];

    this.inLogDateTime = '';
    this.outLogDateTime = '';

    this.fullDayHalfDay = '';
    this.attendanceStatus = '';
    this.getAttendanceLogs();
  }

  getAttendanceLogs() {
    const body = {
      attendanceDate: this.addcomp.value.attendanceDate,
      userMasterID: localStorage.getItem('id'),
    };

    this.spinner.start('main1');
    this.api
      .callApi(this.constant.GETUSERATTENDANCELOGDATEWISE, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.attendanceLogs = res.data;
            this.originalLogs = []; // Reset original logs

            if (
              this.attendanceLogs &&
              this.attendanceLogs.attendancelogs &&
              this.attendanceLogs.attendancelogs.length > 0
            ) {
              this.fullDayHalfDay = this.attendanceLogs.fulldayhalfday || '';
              this.selectedShift = +this.attendanceLogs.Shift

              if (this.fullDayHalfDay === '0') {
                this.attendanceStatus = 'A';
              } else if (this.fullDayHalfDay === '1') {
                this.attendanceStatus = 'P';
              } else if (this.fullDayHalfDay === '0.5') {
                this.attendanceStatus = 'HD';
              } else {
                this.attendanceStatus = '';
              }

              this.inLogDateTime = this.formatDateForInput(this.attendanceLogs.InDatetime);
              this.outLogDateTime = this.formatDateForInput(this.attendanceLogs.OutDateTime);

              if (this.attendanceLogs.InDatetime) {
                this.inLogDateTime = this.formatDateForInput(this.attendanceLogs.InDatetime);
              } else {
                this.inLogDateTime = '';
              }

              if (this.attendanceLogs.OutDateTime) {
                this.outLogDateTime = this.formatDateForInput(this.attendanceLogs.OutDateTime);
              } else {
                this.outLogDateTime = '';
              }

              this.values =
                this.attendanceLogs.attendancelogs.map((log) => {
                  const originalLogDateTime = this.formatDateForInput(log.logDateTime);
                  this.originalLogs.push(originalLogDateTime); // Store original log date

                  return {
                    logId: log.attendanceLogID,
                    logDateTime: originalLogDateTime,
                    direction: log.direction.toUpperCase(),
                    deleted: false,
                    isChangeLog: false, // Default to false
                  };
                }) || [];
            } else {
              this.values = [];
              this.attendanceStatus = 'A';
            }
          } else {
            this.handleError(res.message);
          }
          this.spinner.stop('main1');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main1');
        },
      );
  }


  getShift() {

    this.spinner.start('getshift');
    this.api
      .callApi(this.constant.SHIFTBYCOMPANYDATA2 + localStorage.getItem('company_id'), {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allshift = res.data;
          this.spinner.stop('getshift');
        }
      });
  }

  getAttendanceCorrectionReasons() {
    let body = {
      companyMasterID: localStorage.getItem('company_id'),
    };

    this.spinner.start('getshift');
    this.api
      .callApi(this.constant.LISTATTENDANCECORRECTIONREASON, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.reasons = res.data;
          this.spinner.stop('getshift');
          this.findDefaultReason = this.reasons.find((e) => e.isDefault)
          this.selectedReason = this.findDefaultReason.attendanceCorrectionReasonID
        }
      });
  }

  onReasonChange(): void {
    this.showRemark = +this.findDefaultReason?.attendanceCorrectionReasonID === +this.selectedReason;
  }

  onSubmitAttendaceForm() {
    if (!this.addcomp.valid) {
      return;
    }

    if (this.radiostatus === '3' && this.values.length === 0) {
      this.handleError('Add at least one log.');
      return;
    }

    let attendaceLogs = []
    let correctionStatus;
    if (this.radiostatus === '3') {
      this.log1 = this.values
        .filter((value, index) => !value.deleted)
        .map((value, index) => {
          // Compare with original log to check for changes
          // const hasChanged = value.logDateTime !== this.originalLogs[index];
          return {
            logId: value.logId,
            logDateTime: value.logDateTime,
            direction: value.direction,
            isChangeLog: value.isChangeLog, // True if changed, else false
          };
        });


      if (!this.isLogASCOrder(this.log1)) {
        return this.notifications.create(
          'Error',
          'Please ensure all logs are in the correct chronological order.',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }

      attendaceLogs = this.log1
      correctionStatus = 3
    } else if (this.radiostatus === '2') {
      attendaceLogs = [{ shiftID: this.selectedShift, attendanceStatus: this.attendanceStatus }]
      correctionStatus = 2
    } else if (this.radiostatus === '1') {
      const inLogDateTime = this.inLogDateTime;
      const outLogDateTime = this.outLogDateTime;

      if (new Date(inLogDateTime) > new Date(outLogDateTime)) {
        this.handleError('In log date time cannot be greater than out log date time.');
        return;
      }
      attendaceLogs = [
        { logId: null, logDateTime: inLogDateTime, direction: 'IN', isChangeLog: this.InTimeChage }, // Assuming always changed when submitted
        { logId: null, logDateTime: outLogDateTime, direction: 'OUT', isChangeLog: this.OutTimeChage }, // Assuming always changed when submitted
      ]
      correctionStatus = 1
    }
    const body = {
      userMasterID: +localStorage.getItem('id'),
      AttendanceDate: this.attendanceDate,
      remark: this.showRemark ? this.addcomp.value.remark : '',
      attendanceCorrectionReasonID: +this.addcomp.value.attendanceCorrectionReasonID,
      attendaceLogs: attendaceLogs,
      correctionStatus: correctionStatus,
    };
    this.spinner.start('start');
    this.api
      .callApi(this.constant.ADDATTENDANCECORRECTIONREQUEST, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {

          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([
                this.adminRoot + '/attendances/list_attendance_correction_request',
              ]);
              this.spinner.stop('start');
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop('start');
          }

        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  formatDateForInput(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${String(hours24).padStart(2, '0')}:${minutes}`;
  }

  addvalue() {
    const isFirstLog = this.values.length === 0;
    const lastValue = isFirstLog ? null : this.values[this.values.length - 1];
    const lastDirection = lastValue ? lastValue.direction : 'IN';
    const newDirection = isFirstLog ? 'IN' : lastDirection === 'IN' ? 'OUT' : 'IN';

    const validLogDateTime = lastValue?.logDateTime !== '';

    if (!isFirstLog && !validLogDateTime && lastValue) {
      this.handleError('Previous log date-time is required before adding a new log.');
      return;
    }

    this.values.push({
      logDateTime: '',
      direction: newDirection,
      deleted: false,
      isChangeLog: false,
    });
  }

  removevalue(i: number) {
    this.values.splice(i, 1);
    this.setInOutDirection(this.values);
  }

  // adjustLogs(startIndex: number) {
  //   for (let i = startIndex; i < this.values.length; i++) {
  //     const previousDirection = i > 0 ? this.values[i - 1].direction : 'OUT';

  //     if (i === 0 && this.values[i].direction === 'OUT') {
  //       this.values[i].direction = 'IN';
  //     } else {
  //       this.values[i].direction = previousDirection === 'IN' ? 'OUT' : 'IN';
  //     }
  //   }
  // }

  addLogOnTop(index: number) {
    const newDirection = 'IN';

    if (index > 0) {
      const previousLog = this.values[index - 1];
      if (!previousLog.logDateTime) {
        this.handleError('Previous log date-time is required before adding a new log.');
        return;
      }
    }

    const newLog = {
      logId: null,
      logDateTime: '',
      direction: newDirection,
      deleted: false,
      isChangeLog: true,
    };

    this.values.splice(index, 0, newLog);

    this.values = this.setInOutDirection(this.values);
  }

  changeTime(type: any) {
    if (type == 'in') this.InTimeChage = true;
    if (type == 'out') this.OutTimeChage = true;
  }

  setInOutDirection(logData = []) {
    logData.forEach((item, index) => {
      item.direction = index % 2 === 0 ? 'IN' : 'OUT';
    });

    return logData;
  }


  isLogASCOrder(logs = []) {
    for (let i = 0; i < logs.length - 1; i++) {
      const currentDateTime = new Date(logs[i].logDateTime);
      const nextDateTime = new Date(logs[i + 1].logDateTime);

      if (currentDateTime > nextDateTime) {
        return false; // Found an out-of-order pair
      }
    }
    return true; // All pairs are in order
  }


  addLogForEntry(index: number) {
    const currentLog = this.values[index];
    const newDirection = currentLog.direction === 'IN' ? 'OUT' : 'IN';

    if (index >= 0) {
      const previousLog = this.values[index];
      if (!previousLog.logDateTime) {
        this.handleError('Previous log date-time is required before adding a new log.');
        return;
      }
    }

    const newLog = {
      logId: null,
      logDateTime: '',
      direction: newDirection,
      deleted: false,
      isChangeLog: false,
    };

    this.values = [...this.values.slice(0, index + 1), newLog, ...this.values.slice(index + 1)];

    this.values = this.setInOutDirection(this.values);
  }

  trackByFn(index: number, item: any) {
    return index;
  }

  onDirectionChange(index: number) {
    if (index < this.values.length - 1) {
      const nextLog = this.values[index + 1];
      nextLog.direction = this.values[index].direction === 'IN' ? 'OUT' : 'IN';
    }
  }

  changeLog(log) {
    log.isChangeLog = true;
  }

  onCancel() {
    this.router.navigate([this.adminRoot + '/attendances/list_attendance_correction_request']);
  }

  validateDateTime() {
    this.dateTimeErrors = [];
    for (let i = 1; i < this.values.length; i++) {
      const prevLogDateTime = new Date(this.values[i - 1].logDateTime);
      const currLogDateTime = new Date(this.values[i].logDateTime);
      this.dateTimeErrors[i] = currLogDateTime <= prevLogDateTime;
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline danger',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
