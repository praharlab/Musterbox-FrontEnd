import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import jspdf from 'jspdf';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-form16',
    templateUrl: './form16.component.html',
    styleUrls: ['./form16.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form16Component implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('content') content: ElementRef;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  scrollBarHorizontal: boolean;
  permissionview: any = [];

  body = {
    userMasterID: '',
    financialYear: '',
  };

  rows: any;
  previousFinancialYears: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.getYear();
    this.checkpermission();
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'Form16' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  getYear() {
    this.spinner.start('year');
    this.api
      .callApi(this.constant.GETPREVIOUSFINANCIALYEARS, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.previousFinancialYears = res.data;

        }
        this.spinner.stop('year');
      });
  }

  onSubmit(val?: any) {
    this.body.userMasterID = val?.user;
    this.body.financialYear = val?.financialYear;

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETFORM16REPORT, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = 'data:application/pdf;base64,' + res.data;
          if(res.data){
            this.showButtons.push(CommonFilterButtonFields.Excel)
          }else{
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
        } else {
          this.handleError(res.message)
          this.rows = ''
        }
        this.spinner.stop('submit');
      }, (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit');
        this.rows = ''
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
    let base64String = this.rows;
    this.downloadPdf(base64String, 'Form 16');
  }

  clear() {
    this.rows = '';
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

}
