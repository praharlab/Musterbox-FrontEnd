import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-salaryslip',
    templateUrl: './salaryslip.component.html',
    styleUrls: ['./salaryslip.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SalaryslipComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  salarydata: any;
  apiURL = environment.apiUrl;
  deduction: any = [];
  earning: any = [];
  totaldeduction: any;
  totalearning: any;
  nettotal: any;
  outputWords: string;
  month: string;
  year: string;

  @ViewChild('pdfTable')
  pdfTable!: ElementRef;
  leaveinformation: any;
  presentdays: any;
  absentdays: any;
  departments: any;
  designation: any;
  branch: any;
  paidleave: any;
  finalpaidleave: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {}

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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalarySlip' &&
              permissionval.operationName.includes('Download')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalarySlip' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalarySlip' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SalarySlip' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  salaryslip() {
    const body = {
      yyyymm: this.datefilter.value.YearMM.replace('-', ''),
      userMasterID: localStorage.getItem('id'),
    };
    this.spinner.start();
    this.api.callApi(this.constant.SALARYDATAUSER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.salarydata = res.data;
        if (!this.salarydata) {
          this.notifications.create('Message', 'No Salary Slip Found!', NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
        } else {
          this.salarydata.path = 'data:application/pdf;base64,' + this.salarydata.path;
        }

        this.spinner.stop();
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.salarydata.path;
    this.downloadPdf(base64String, 'Salary Slip');
  }
}
