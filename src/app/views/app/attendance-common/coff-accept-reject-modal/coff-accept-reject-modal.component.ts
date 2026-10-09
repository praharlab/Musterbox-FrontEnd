import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-coff-accept-reject-modal',
    templateUrl: './coff-accept-reject-modal.component.html',
    styleUrls: ['./coff-accept-reject-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CoffAcceptRejectModalComponent implements OnInit {
  @ViewChild('closeModal1') closeModal: ElementRef;
  @ViewChild('accept') accept: NgForm;
  @ViewChild('lgModal1') lgModal1;
  @ViewChild('lgModal2') lgModal2;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal2') closeModal1: ElementRef;

  CompensatoryOffAuthorizationID: any;
  coffMasterID: any;
  referencedata: any = null;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {}
  async alertAcceptConfirmation(CompensatoryOffAuthorizationID: any, coffMasterID: any) {
    this.referencedata = null;
    this.CompensatoryOffAuthorizationID = CompensatoryOffAuthorizationID;
    this.coffMasterID = coffMasterID;
    this.getCoffData()
      .then(() => {
        this.lgModal1.show();
      })
      .catch((err) => {
        this.handleError(err.error.message);
      });
  }

    async alertRejectConfirmation(CompensatoryOffAuthorizationID: any, coffMasterID: any) {
    this.referencedata = null;
    this.CompensatoryOffAuthorizationID = CompensatoryOffAuthorizationID;
    this.coffMasterID = coffMasterID;
    this.getCoffData()
      .then(() => {
        this.lgModal2.show();
      })
      .catch((err) => {
        this.handleError(err.error.message);
      });
  }
  private getCoffData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('loader');
      this.api
        .callApi(
          this.constant.GETCOMPENSATORYOFFDATABYREFERENCEID + this.coffMasterID,
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
            this.handleError(err.error.message);
            reject(err);
          },
        );
    });
  }

  acceptCompensatoryOff() {
    if (!this.CompensatoryOffAuthorizationID) return;

    const body = {
      CompensatoryOffAuthorizationID: this.CompensatoryOffAuthorizationID,
      authstatus: 1,
      remarks: this.accept.value.remarks,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };
    this.spinner.start('acceptCompensatoryOff');
    this.api
      .callApi(this.constant.COMPENSATORYOFFAUTHREQUESTACCEPTREJECT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.closeModal.nativeElement.click();
              this.accept.resetForm();
              setTimeout(() => {
                this.modalService.refreshUserRequestStatus();
              }, 1000);
              this.spinner.stop('acceptCompensatoryOff');
            }, 200);
          } else {
            this.handleError(res.message);
            this.spinner.stop('acceptCompensatoryOff');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('acceptCompensatoryOff');
        },
      );
  }

  rejectCompensatoryOff() {
    if (!this.CompensatoryOffAuthorizationID) return;
    const body = {
      CompensatoryOffAuthorizationID: this.CompensatoryOffAuthorizationID,
      authstatus: 0,
      remarks: this.reject.value.remarks,
      // coffMasterID:  this.authData.coffMasterID,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

    this.spinner.start('rejectCompensatoryOff');
    this.api
      .callApi(this.constant.COMPENSATORYOFFAUTHREQUESTACCEPTREJECT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            setTimeout(() => {
              this.closeModal1.nativeElement.click();
              this.reject.resetForm();
              setTimeout(() => {
                this.modalService.refreshUserRequestStatus();
              }, 1000);
              this.spinner.stop('rejectCompensatoryOff');
            }, 200);

            this.spinner.stop('rejectCompensatoryOff');
          } else {
            this.handleError(res.message);
            this.spinner.stop('rejectCompensatoryOff');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('rejectCompensatoryOff');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
