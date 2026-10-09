import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-five-minute-gap-tracking-report',
    templateUrl: './five-minute-gap-tracking-report.component.html',
    styleUrls: ['./five-minute-gap-tracking-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FiveMinuteGapTrackingReportComponent implements OnInit {
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.SUBMIT_EXPORT, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company ]
  filterData = {
    userMasterID: null
  }
  permissionview: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
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
              permissionval.formName == 'FiveMinuteGapTrackingReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  download(val: any) {
    let body1 = {
      userMasterID: val?.user ? val.user : this.filterData.userMasterID,
      date: val?.date,
      exportData: 'true',
      exportFileType: 'xlsx',
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.FIVEMINUTEGAPYRACKINGREPORT, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('Alert', 'No data found to export!', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('download');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `5_Minute_Gap_Tracking_Report${body1.date}.xlsx`);

            this.spinner.stop('download');
          }
        },
        (err) => {
          this.handleError();
          this.spinner.stop('download');
        },
      );
  }

  private handleError() {
    this.notifications.create('Error', 'Someting Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  clear(){
    this.filterData = {
      userMasterID: null
    }
  }
}
