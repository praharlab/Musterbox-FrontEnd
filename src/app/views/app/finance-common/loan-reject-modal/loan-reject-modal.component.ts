import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service'

@Component({
    selector: 'app-loan-reject-modal',
    templateUrl: './loan-reject-modal.component.html',
    styleUrls: ['./loan-reject-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LoanRejectModalComponent implements OnInit {
  LoanID: number;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') lgModal: any;
  @Output() onSubmitSuccess = new EventEmitter<void>();



  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private modalService: ModalService

  ) { }

  ngOnInit(): void {
  }

  button(data: any) {
    this.LoanID = data
  }

  onSubmit1() {
    const body = {
      LoanID: this.LoanID,
      loanstatus: '2',
      LoanRemark: this.reject.value.remarks,
    };
    this.spinner.start('loader');
    this.api.callApi(this.constant.LOANSTATUSREQUEST, body, 'POST', true, true, true).subscribe(
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
          this.onSubmitSuccess.emit();
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

