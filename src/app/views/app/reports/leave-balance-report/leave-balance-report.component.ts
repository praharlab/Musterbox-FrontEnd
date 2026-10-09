import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import jspdf from 'jspdf';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { CommonUtils } from 'src/app/utils/common.utils';

@Component({
    selector: 'app-leave-balance-report',
    templateUrl: './leave-balance-report.component.html',
    styleUrls: ['./leave-balance-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LeaveBalanceReportComponent implements OnInit {
  // @ViewChild('content') content: ElementRef;
  scrollBarHorizontal: boolean;
  permissionview: any = [];
  // selected: any[];
  body = {
    userMasterID: '',
    companyMasterID: '',
    year: [],
  };

  yearDropDownData: any = [];
  leaveBalanceData: any;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear]
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.yearDropDownData = CommonUtils.getYear(10);
    CommonUtils.selectAllForDropdownItems(this.yearDropDownData);
    // this.selected = this.year;
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
              permissionval.formName == 'LeavebalanceReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  onSubmit(val? : any) {
    this.leaveBalanceData = '';

    this.body.userMasterID = val?.user;
    this.body.year = val?.fromdate;
    this.body.companyMasterID = val?.company;
    this.spinner.start();
    this.api
      .callApi(this.constant.LEAVEBALANCEREPORT, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.leaveBalanceData = 'data:application/pdf;base64,' + res.data;
          this.showButtons.push(CommonFilterButtonFields.Pdf)
          this.spinner.stop();
        } else {
          this.commonNotificationService.handleError(res.message)
          this.spinner.stop();
        }
      });
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  onClickDownloadPdf() {
    let base64String = this.leaveBalanceData;
    this.downloadPdf(base64String, 'Leave Balance Report');
  }

  clear() {
    setTimeout(() => {
      this.leaveBalanceData = '';
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear]
      this.ngOnInit();
    }, 200);
  }
}
