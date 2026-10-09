import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
@Component({
    selector: 'app-add-team-advance-request',
    templateUrl: './add-team-advance-request.component.html',
    styleUrls: ['./add-team-advance-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTeamAdvanceRequestComponent implements OnInit {
  @ViewChild('addreqadvancepay') addreqadvancepay: NgForm;
  adminRoot = environment.adminRoot;
  copersonlist: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private modalService: ModalService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.getReportToWithoutChild();
  }

  onSubmit() {
    if (!this.addreqadvancepay.valid) {
      return;
    }
    if (+this.addreqadvancepay.value.advanceAmount <= 0) {
      return this.commonNotificationService.handleWarning('Amount Can not be Zero Or Negative');
    }
    const body = {
      userMasterID: this.addreqadvancepay.value.userMasterID,
      description: this.addreqadvancepay.value.Description,
      amount: this.addreqadvancepay.value.advanceAmount,
      paymentYearMonth: this.addreqadvancepay.value.PaymentYearMonth.replace('-', ''),
      AdvanceStatus: 0,
    };

    this.api.callApi(this.constant.CREATEADVANCEPAYMENT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
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
