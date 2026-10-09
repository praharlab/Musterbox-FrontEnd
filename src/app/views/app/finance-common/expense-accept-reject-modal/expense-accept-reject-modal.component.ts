import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-expense-accept-reject-modal',
    templateUrl: './expense-accept-reject-modal.component.html',
    styleUrls: ['./expense-accept-reject-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ExpenseAcceptRejectModalComponent implements OnInit {
  @ViewChild('accept') accept: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('acceptModal') acceptModal;

  @ViewChild('reject') reject: NgForm;
  @ViewChild('rejectModal') rejectModal;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @Output() acceptReject = new EventEmitter<any>();

  expeseAuthorizationData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {}

  getExpenseAuthorizationData(id: any) {
    this.spinner.start('loader');
    this.api
      .callApi(
        this.constant.GETEXPENSEAUTHORIZATIONREQUESTBYAUTHORIZATIONREQUESTID + id,
        {},
        'GET',
        false,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.expeseAuthorizationData = res.data;
            this.spinner.stop('loader');
          } else {
            this.handleCatchError();
          }
        },
        () => {
          this.handleCatchError();
        },
      );
  }

  onAcceptSubmit() {
    const body = {
      newArray: [
        {
          userexpensetransactionid: this.expeseAuthorizationData[0].ReferenceID,
          authorizationrequestid: this.expeseAuthorizationData[0].AuthorizationRequestId,
          remarks: this.accept.value.remarks,
        },
      ],
      authstatus: 1,
      companyMasterID: localStorage.getItem('company_id'),
      updateBy: localStorage.getItem('id'),
    };
    this.spinner.start('loader');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTEXPENSEALL, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'Expense Accepted Successfully',
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
            }, 3000);
            this.closeModal.nativeElement.click();
            this.accept.resetForm();

            this.spinner.stop('loader');
          } else {
            this.handleCatchError();
            this.closeModal.nativeElement.click();
            this.accept.resetForm();
          }
        },
        () => {
          this.handleCatchError();
        },
      );
  }

  onRejectSubmit() {
    if (!this.reject.valid) return;
    const body = {
      newArray: [
        {
          userexpensetransactionid: this.expeseAuthorizationData[0].ReferenceID,
          authorizationrequestid: this.expeseAuthorizationData[0].AuthorizationRequestId,
          remarks: this.reject.value.remarks,
        },
      ],
      authstatus: 0,
      companyMasterID: localStorage.getItem('company_id'),
      updateBy: localStorage.getItem('id'),
    };

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.AUTHREQUESTACCEPTREJECTEXPENSEALL, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              'Expense Rejected Successfully',
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
            }, 3000);
            this.closeModal1.nativeElement.click();
            this.reject.resetForm();

            this.spinner.stop('loader');
          } else {
            this.closeModal1.nativeElement.click();
            this.reject.resetForm();
            this.handleCatchError();
          }
        },
        () => {
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
