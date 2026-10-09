import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-edit-attendance-correction-request',
    templateUrl: './edit-attendance-correction-request.component.html',
    styleUrls: ['./edit-attendance-correction-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAttendanceCorrectionRequestComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  editData: any;
  formValue: any;

  radiostatus: string;
  adminRoot = environment.adminRoot;
  todayDate: any;
  values = [];
  attendanceDate: string;
  attendanceStatus: string;
  ipAddress: any;

  inLogDateTime: any;
  outLogDateTime: any;
  maxDate: string;

  minDate: string;

  log1: any[] = [];
  statusArray: any[] = [];
  remark: any;

  currentDate: string;
  tomorrowDate: string;
  filteredValues = [];
  attendanceLogs: any = [];
  disabledFields: Set<number> = new Set();
  fullDayHalfDay: any;
  allshift: any;
  selectedShift: any;
  InTimeChage: boolean = false;
  OutTimeChage: boolean = false;
  selectedReason: any;
  findDefaultReason: any;
  reasons: any;
  showRemark: boolean = true;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];

    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    this.minDate = `${previousMonth.getFullYear()}-${('0' + (previousMonth.getMonth() + 1)).slice(
      -2,
    )}-${('0' + previousMonth.getDate()).slice(-2)}`;

    this.maxDate = this.todayDate;

    this.getAttendanceCorrectionReasons()
    this.editdata();
    this.getIPAddress();
    this.getShift();
  }
  getAttendanceCorrectionReasons() {
    let body = {
      companyMasterID: +localStorage.getItem('company_id'),
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
    this.adjustLogs(i);
  }

  adjustLogs(startIndex: number) {
    for (let i = startIndex; i < this.values.length; i++) {
      const previousDirection = i > 0 ? this.values[i - 1].direction : 'OUT';

      if (i === 0 && this.values[i].direction === 'OUT') {
        this.values[i].direction = 'IN';
      } else {
        this.values[i].direction = previousDirection === 'IN' ? 'OUT' : 'IN';
      }
    }
  }

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
      logDateTime: '',
      direction: newDirection,
      deleted: false,
      isChangeLog: false,
    };

    this.values.splice(index, 0, newLog);

    this.adjustLogs(index + 1);
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
      logDateTime: currentLog.logDateTime,
      direction: newDirection,
      deleted: false,
      isChangeLog: false,
    };

    this.values = [...this.values.slice(0, index + 1), newLog, ...this.values.slice(index + 1)];

    this.adjustLogs(index + 1);
  }

  trackByFn(index: number, item: any) {
    return index; // or item.id if you have unique identifiers
  }

  getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getTomorrowDate(date: string): string {
    const selectedDate = new Date(date);
    selectedDate.setDate(selectedDate.getDate() + 1);
    return this.getFormattedDate(selectedDate);
  }

  filterLogsByDate(date: string) {
    this.filteredValues = this.values.filter((log) => {
      const logDate = new Date(log.logDateTime).toISOString().split('T')[0];
      return logDate === date;
    });
  }

  onAttendanceDateChange(newDate: string) {
    this.currentDate = newDate;
    this.tomorrowDate = this.getTomorrowDate(newDate);

    this.values = [];
    this.inLogDateTime = '';
    this.outLogDateTime = '';

    this.getAttendanceLogs();
  }

  getAttendanceLogs() {
    const body = {
      attendanceDate: this.attendanceDate,
      userMasterID: localStorage.getItem('id'),
    };

    this.spinner.start('main1');
    this.api
      .callApi(this.constant.GETUSERATTENDANCELOGDATEWISE, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.attendanceLogs = res.data;

            if (
              this.attendanceLogs &&
              this.attendanceLogs.attendancelogs &&
              this.attendanceLogs.attendancelogs.length > 0
            ) {
              this.inLogDateTime = this.formatDateForLogsInput(this.attendanceLogs.InDatetime);
              this.outLogDateTime = this.formatDateForLogsInput(this.attendanceLogs.OutDateTime);

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

              if (this.attendanceLogs.InDatetime) {
                this.inLogDateTime = this.formatDateForLogsInput(this.attendanceLogs.InDatetime);
              } else {
                this.inLogDateTime = '';
              }

              if (this.attendanceLogs.OutDateTime) {
                this.outLogDateTime = this.formatDateForLogsInput(this.attendanceLogs.OutDateTime);
              } else {
                this.outLogDateTime = '';
              }

              this.values =
                this.attendanceLogs.attendancelogs.map((log, index) => {
                  this.disabledFields.add(index);
                  return {
                    logId: log.attendanceLogID,
                    logDateTime: this.formatDateForLogsInput(log.logDateTime),
                    direction: log.direction.toUpperCase(),
                    deleted: false,
                    isChangeLog: false,
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

  editdata() {
    let id = this.formValue.ListAttendanceCorrectionRequestComponent.id;

    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETATTENDANCECORRECTIONBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.editData = res.data;
            this.attendanceDate = this.editData.AttendanceDate;

            this.currentDate = this.attendanceDate;
            this.tomorrowDate = this.getTomorrowDate(this.attendanceDate);

            // this.onAttendanceDateChange(this.attendanceDate);

            this.remark = this.editData.remark || '';
            this.selectedReason = this.editData.attendanceCorrectionReasonID
            this.onReasonChange()
            if (this.editData && this.editData.attendanceCorrectionLogs.length) {
              const firstLog = this.editData.attendanceCorrectionLogs[0];
              if (firstLog.attendanceStatus) {
                this.radiostatus = '2';
                this.attendanceStatus = firstLog.attendanceStatus;
                this.selectedShift = firstLog.shiftID
              } else if (this.editData.correctionStatus === 1) {
                this.radiostatus = '1';

                this.inLogDateTime = this.formatDateForLogsInput(this.editData.attendanceCorrectionLogs[0].logDateTime);

                this.InTimeChage = this.editData.attendanceCorrectionLogs[0].isChangeLog;

                this.outLogDateTime = this.formatDateForLogsInput(
                  this.editData.attendanceCorrectionLogs[1].logDateTime,
                );

                this.OutTimeChage = this.editData.attendanceCorrectionLogs[1].isChangeLog;
              } else {
                this.radiostatus = '3';
                this.values = this.editData.attendanceCorrectionLogs.map((log) => ({
                  logId: log.logId,
                  logDateTime: log.logDateTime ? this.formatDateForLogsInput(log.logDateTime) : '',
                  direction: log.direction || '',
                  deleted: false,
                  isChangeLog: log.isChangeLog,
                }));
              }
            } else {
              this.radiostatus = '3';
            }
          }
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  onSubmitAttendaceForm() {
    if (!this.addcomp.valid) {
      return;
    }

    let body: any;
    const userMasterID = localStorage.getItem('id');
    const attendanceDate = this.attendanceDate;
    let attendaceLogs = []
    let correctionStatus;
    if (this.radiostatus === '1') {
      const inLogDateTime = this.inLogDateTime;
      const outLogDateTime = this.outLogDateTime;

      if (new Date(inLogDateTime) > new Date(outLogDateTime)) {
        this.handleError('In log date time cannot be greater than out log date time.');
        return;
      }

      body = {
        userMasterID: localStorage.getItem('id'),
        AttendanceDate: this.addcomp.value.attendanceDate,
        remark: this.showRemark ? this.addcomp.value.remark : '',
        attendaceLogs: [
          {
            logId: null,
            isChangeLog: this.InTimeChage,
            logDateTime: inLogDateTime,
            direction: 'IN',
          },
          {
            logId: null,
            isChangeLog: this.OutTimeChage,
            logDateTime: outLogDateTime,
            direction: 'OUT',
          },
        ],
        correctionStatus: 1,
        attendanceCorrectionReasonID: +this.addcomp.value.attendanceCorrectionReasonID,

      };
    } else if (this.radiostatus === '2') {
      this.statusArray = [
        {
          shiftID: this.selectedShift,
          attendanceStatus: this.attendanceStatus,
        },
      ];

      body = {
        userMasterID,
        AttendanceDate: attendanceDate,
        remark: this.showRemark ? this.addcomp.value.remark : '',
        attendaceLogs: this.statusArray,
        correctionStatus: 2,
        attendanceCorrectionReasonID: +this.addcomp.value.attendanceCorrectionReasonID,
      };
    } else {
      this.log1 = this.values
        .filter((value) => !value.deleted && value.logDateTime)
        .map((value) => ({
          logId: value.logId,
          logDateTime: value.logDateTime,
          direction: value.direction,
          isChangeLog: value.isChangeLog
        }));

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


      body = {
        userMasterID,
        AttendanceDate: attendanceDate,
        remark: this.showRemark ? this.addcomp.value.remark : '',
        attendaceLogs: this.log1,
        correctionStatus: 3,
        attendanceCorrectionReasonID: +this.addcomp.value.attendanceCorrectionReasonID,
      };
    }

    this.spinner.start('start');

    this.api
      .callApi(
        this.constant.UPDATEATTENDANCECORRECTIONREQUEST +
        this.formValue.ListAttendanceCorrectionRequestComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
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

  changeLog(log) {
    log.isChangeLog = true;
  }

  onCancel() {
    this.router.navigate([this.adminRoot + '/attendances/list_attendance_correction_request']);
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

  getMinDateTime(): string {
    if (!this.attendanceDate) return '';
    return this.attendanceDate + 'T00:00';
  }

  getMaxDateTime(): string {
    if (!this.attendanceDate) return '';
    const tomorrow = new Date(this.attendanceDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  }

  // Function to format the date for datetime-local input
  formatDateForLogsInput(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${String(hours24).padStart(2, '0')}:${minutes}`;
  }

  onReasonChange(): void {
    this.showRemark = +this.findDefaultReason?.attendanceCorrectionReasonID === +this.selectedReason;
  }
}
