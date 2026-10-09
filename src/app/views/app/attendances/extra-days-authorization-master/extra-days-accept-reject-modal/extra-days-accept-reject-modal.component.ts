import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-extra-days-accept-reject-modal',
    templateUrl: './extra-days-accept-reject-modal.component.html',
    styleUrls: ['./extra-days-accept-reject-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExtraDaysAcceptRejectModalComponent implements OnInit {
  @ViewChild('closeModal1') closeModal: ElementRef;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('lgModal1') lgModal1;
  @ViewChild('lgModal2') lgModal2;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal2') closeModal1: ElementRef;

  extraDaysAuthorizationID: any;
  referencedata: any = null;
  extraDaysID: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {}

  acceptCompensatoryOff() {
    if (!this.extraDaysAuthorizationID) return;

    const body = {
      extraDaysAuthorizationID: this.extraDaysAuthorizationID,
      authStatus: 1,
      remarks: this.accept.value.remarks,
      userMasterID: localStorage.getItem('id'),
    };
    this.spinner.start('acceptCompensatoryOff');
    this.api
      .callApi(this.constant.EXTRADAYSAUTHORIZATIONACCEPTREJECT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              this.closeModal.nativeElement.click();
              this.accept.resetForm();
              setTimeout(() => {
                this.modalService.refreshUserRequestStatus();
              }, 1000);
              this.spinner.stop('acceptCompensatoryOff');
            }, 200);
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('acceptCompensatoryOff');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('acceptCompensatoryOff');
        },
      );
  }

  rejectCompensatoryOff() {
    if (!this.extraDaysAuthorizationID) return;
    const body = {
      extraDaysAuthorizationID: this.extraDaysAuthorizationID,
      authStatus: 0,
      remarks: this.reject.value.remarks,
      userMasterID: localStorage.getItem('id'),
    };

    this.spinner.start('rejectExtraDays');
    this.api
      .callApi(this.constant.EXTRADAYSAUTHORIZATIONACCEPTREJECT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);

            setTimeout(() => {
              this.closeModal1.nativeElement.click();
              this.reject.resetForm();
              setTimeout(() => {
                this.modalService.refreshUserRequestStatus();
              }, 1000);
              this.spinner.stop('rejectExtraDays');
            }, 200);

            this.spinner.stop('rejectExtraDays');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('rejectExtraDays');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('rejectExtraDays');
        },
      );
  }

  getData(id: any) {
    this.extraDaysAuthorizationID = id;
  }

  async alertAcceptConfirmation(extraDaysAuthorizationID: any, extraDaysID: any) {
    this.referencedata = null;
    this.extraDaysAuthorizationID = extraDaysAuthorizationID;
    this.extraDaysID = extraDaysID;
    this.getExtraDaysData()
      .then(() => {
        this.lgModal1.show();
      })
      .catch((err) => {
        this.commonNotificationService.handleError(err.error.message);
      });
  }

  async alertRejectConfirmation(extraDaysAuthorizationID: any, extraDaysID: any) {
    this.referencedata = null;
    this.extraDaysAuthorizationID = extraDaysAuthorizationID;
    this.extraDaysID = extraDaysID;
    this.getExtraDaysData()
      .then(() => {
        this.lgModal2.show();
      })
      .catch((err) => {
        this.commonNotificationService.handleError(err.error.message);
      });
  }

  private getExtraDaysData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('loader');
      this.referencedata = null;

      this.api
        .callApi(
          this.constant.GETEXTRADAYSAUTHORIZATIONBYID + this.extraDaysID,
          {},
          'GET',
          false,
          false,
          true,
        )
        .subscribe(
          (res: any) => {
            this.referencedata = res.data;
            this.spinner.stop('loader');
            resolve();
          },
          (err) => {
            this.commonNotificationService.handleError(err.error.message);
            reject(err);
          },
        );
    });
  }
}
