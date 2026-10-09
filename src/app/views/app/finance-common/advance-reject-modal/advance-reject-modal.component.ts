import { Component, ViewChild, OnInit, ElementRef, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { NgForm } from '@angular/forms';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-advance-reject-modal',
    templateUrl: './advance-reject-modal.component.html',
    styleUrls: ['./advance-reject-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdvanceRejectModalComponent implements OnInit {
  advancePaymentID: any;

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') lgModal;
  @ViewChild('reject') reject: NgForm;

  selectedRow: any;
  rows: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void { }

  button(data) {
    this.advancePaymentID = data;
  }

  onSubmit1() {
    const body = {
      advancePaymentID: this.advancePaymentID,
      AdvanceStatus: '2', // Rejected status
      RejectionRemark: this.reject.value.remarks,
    };

    this.spinner.start('loader');
    this.api.callApi(this.constant.POSTSTATUSREQUEST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status != 200) {
          this.handleCatchError();
        } else {
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
          }, 2000);
          this.closeModal.nativeElement.click();
          this.reject.resetForm();
          this.spinner.stop('loader');
        }
      },
      (err) => {
        this.handleCatchError();
      },
    );
  }

  handleCatchError() {
    this.spinner.stop('loader');
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }
}
