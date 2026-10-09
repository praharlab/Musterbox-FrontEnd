import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
@Component({
    selector: 'app-edit-team-advance-request',
    templateUrl: './edit-team-advance-request.component.html',
    styleUrls: ['./edit-team-advance-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTeamAdvanceRequestComponent implements OnInit {
  @ViewChild('editadvancepayment') editadvancepayment: NgForm;
  adminRoot = environment.adminRoot;
  employee: any;
  advanceData: any;
  formValue: any;
  copersonlist: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getReportToWithoutChild();
  }

  editdata() {
    let advanceid = this.formValue.ListTeamAdvanceRequestComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETADVANCEBYID + '/' + advanceid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.advanceData = res.data;
          this.advanceData.userMasterID = parseInt(this.advanceData.userMasterID);
          this.advanceData.paymentYearMonth =
            JSON.stringify(this.advanceData.paymentYearMonth).slice(0, 4) +
            '-' +
            JSON.stringify(this.advanceData.paymentYearMonth).slice(4);
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  onSubmit() {
    if (!this.editadvancepayment.valid) {
      return;
    }

    if (+this.editadvancepayment.value.advanceAmount <= 0) {
     return this.commonNotificationService.handleWarning('Amount Can not be Zero Or Negative');
    }
    let body = {
      advancePaymentID: this.formValue.ListTeamAdvanceRequestComponent.id,
      description: this.editadvancepayment.value.Description,
      amount: this.editadvancepayment.value.advanceAmount,
      paymentYearMonth: this.editadvancepayment.value.PaymentYearMonth.replace('-', ''),
    };

    this.api
      .callApi(this.constant.UPDATEADVANCEBYREPORTEE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/finances/teamAdvanceRequest']);
              this.spinner.stop();
            }, 3000);
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }
  getReportToWithoutChild() {
    let id = +localStorage.getItem('id');
    this.spinner.start();
    this.api.callApi(this.constant.REPORTTO2 + id, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.copersonlist = res.data;
          this.editdata();
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }
}
