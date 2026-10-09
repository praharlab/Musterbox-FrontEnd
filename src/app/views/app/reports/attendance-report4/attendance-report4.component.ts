import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterFields, CommonFilterButtonFields, CommonRequiredFields } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-attendance-report4',
    templateUrl: './attendance-report4.component.html',
    styleUrls: ['./attendance-report4.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AttendanceReport4Component implements OnInit {
  scrollBarHorizontal: boolean;
  permissionview: any = [];
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.SUBMIT_EXPORT];
  previousMonth: string;
  showRequiredFields: any = [CommonRequiredFields.Company]
  filterData = {
    userMasterID: null
  }
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private downloadFileService: DownloadFileService,
    private commonNotificationService: CommonNotificationService,
  ) {
  }

  ngOnInit() {
    this.checkpermission();
    const today = new Date();
    this.previousMonth = today.toISOString().substring(0, 7); // Format YYYY-MM
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
              permissionval.formName == 'AttendanceRegister-4' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    const body = {
      userMasterID: val.user ? val.user : this.filterData.userMasterID,
      YearMM: val?.YearMM,
    };

    this.spinner.start('a');

    this.api
      .callApi(this.constant.ATTENDANCEREPORT4, body, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.commonNotificationService.handleWarning('No data found to export!')
            this.spinner.stop('a');
          } else {
            this.downloadFileService.handleFileDownload(res, 'Attendance Register-4.xlsx', 'text/xlsx')
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message || 'Someting Went Wrong!')
          this.spinner.stop('a');
        },
      );
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
