import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-monthly-attendance-entry',
    templateUrl: './monthly-attendance-entry.component.html',
    styleUrls: ['./monthly-attendance-entry.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MonthlyAttendanceEntryComponent implements OnInit {
  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.User,
    CommonFilterFields.WorkingArea,
  ];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  columnMode = ColumnMode.force;

  filterData = {
    companyMasterID: null,
    branchMasterID: null,
    YYYYMM: '',
    Export: false,
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  rows: any = [];

  permissionview: any = [];
  permissionedit: any = [];
  finalDataToAdd: any = [];
  permissiondelete: any = [];
  permissioncreate: any = [];
  currentMonth: any = '';

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    this.currentMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0');
  }

  onPresentChange(row: any): void {
    this.finalDataToAdd = this.finalDataToAdd.filter((e) => e.userMasterID != row.userMasterID);

    const present = +row.Present || 0;
    const holiday = +row.Holiday || 0;
    const PaidLeaves = +row.PaidLeaves || 0;
    const UnPaidLeaves = +row.UnPaidLeaves || 0;
    const totalDays = +row.totalDays || 0;

    if (present < 0 || +present % 0.5 != 0) {
      const message = present < 0 ? 'Present days cannot be negative.' : 'Only half-day increments are allowed for Present.';

      this.commonNotificationService.handleWarning(message);
      row.Present = 0;
      row.Absent =
        +row.totalDays - (+row.Holiday || 0) - (+row.WeekOff || 0) - (+row.PaidLeaves || 0) - (+row.UnPaidLeaves || 0);

      this.finalDataToAdd.push(row);

      return;
    }

  
    // Calculate WeekOff if policy is based on Present Days
    if (row.weekoffPolicyType === 'onPresentDay' && +row.Weekoffvalue) {
      row.WeekOff = Math.floor((+present + +holiday + +PaidLeaves) / +row.Weekoffvalue);
    }

    const weekOff = +row.WeekOff || 0;
  

    const absent = totalDays - (present + weekOff + holiday + PaidLeaves + UnPaidLeaves);

    if (absent < 0) {
      this.commonNotificationService.handleWarning(
        `Values exceed the total available days (${totalDays}).`,
      );
      row.Present = 0;

      if (row.weekoffPolicyType === 'onPresentDay' && +row.Weekoffvalue) {
        row.WeekOff = 0;
      }

      row.Absent = totalDays - (holiday + +row.WeekOff + PaidLeaves + UnPaidLeaves);

      this.finalDataToAdd.push(row);
      return;
    }

    row.Absent = absent;

    this.finalDataToAdd.push(row);
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MonthlyAttendanceEntry' &&
              permissionval.operationName.includes('View')
            );
          });

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MonthlyAttendanceEntry' &&
              permissionval.operationName.includes('Edit')
            );
          });

          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MonthlyAttendanceEntry' &&
              permissionval.operationName.includes('Delete')
            );
          });

          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MonthlyAttendanceEntry' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  getAllData(isDeleted?: boolean) {
    this.spinner.start('monthlyAttendanceEntry');
    this.api
      .callApi(
        this.constant.GETMONTHLYATTENDANCEENTRY,
        this.filterData,
        'POST',
        true,
        true,
        true,
        this.filterData.Export,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.downloadFileService.handleFileDownload(
              res,
              'MonthlyAttendanceEntry.xlsx',
              'text/xlsx',
            );
            this.filterData.Export = false;
            this.spinner.stop('monthlyAttendanceEntry');
          } else {
            if (res.status == 200) {
              this.rows = res.data;
              if (isDeleted) {
                this.rows = this.rows.map((x) => {
                  const formValueData = this.formValueStorageService.getData();
               
                  const currentRow = formValueData.MONTHLYATTENDANCEDATA.find(
                    (data) => data.userMasterID == x.userMasterID,
                  );
                  if (currentRow) {
                    return currentRow;
                  } else {
                    return x;
                  }
                });
              }
              if (this.rows.length > 0) {
                this.showButtons.push(CommonFilterButtonFields.Excel);
              } else {
                this.showButtons = [
                  CommonFilterButtonFields.Submit,
                  CommonFilterButtonFields.Clear,
                ];
              }
              this.page.totalCount = res.totalcount;
              this.spinner.stop('monthlyAttendanceEntry');
            }else{
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('monthlyAttendanceEntry');
            }
          }
        },
        (error) => {
          this.commonNotificationService.handleError(error.error.message);
          this.spinner.stop('monthlyAttendanceEntry');
        },
      );
  }

  clear() {
    this.rows = [];
    this.finalDataToAdd = [];

    this.showButtons = [
      CommonFilterButtonFields.Submit,
      CommonFilterButtonFields.Clear,
    ];

    this.filterData = {
      companyMasterID: null,
      branchMasterID: null,
      YYYYMM: '',
      Export: false,
    };
  }

  exportData() {
    this.filterData.Export = true;
    this.getAllData();
  }

  onSubmit(val: any) {
    this.filterData.companyMasterID = val.company;
    this.filterData.branchMasterID = val.branch;
    this.filterData.YYYYMM = val.yyyymm?.replace('-', '');
    this.filterData.Export = false;
    this.getAllData();
  }

  saveData() {
    const body = {
      dataArray: this.finalDataToAdd,
      companyMasterID: this.filterData.companyMasterID,
      YYYYMM: this.filterData.YYYYMM,
    };

    this.spinner.stop('saveData');
    this.api
      .callApi(this.constant.SAVEMONTHLYATTENDANCEENTRY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              this.clear();
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (error) => {
          this.spinner.stop('saveData');
          this.commonNotificationService.handleSuccess(error.error.message);
        },
      );
  }

  cancel() {
    return this.router.navigate(['/app/payrolls']);
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
          userMasterID: [id],
          YYYYMM: this.filterData.YYYYMM,
        };
        this.spinner.start('active');

        this.finalDataToAdd = this.finalDataToAdd.filter(x => x.userMasterID != id);

        this.formValueStorageService.addData('MONTHLYATTENDANCEDATA', this.finalDataToAdd);
        this.api
          .callApi(this.constant.DELETEMONTHLYATTENDANCEENTRY, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.commonNotificationService.handleSuccess(res.message);
                this.getAllData(true);
              } else {
                this.commonNotificationService.handleError(res.message);
              }

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

  ngOnDestroy() {
    this.formValueStorageService.removeData('MONTHLYATTENDANCEDATA', false)
  }
}
