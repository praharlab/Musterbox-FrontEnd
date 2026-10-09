import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service'
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-employee-document-reject',
    templateUrl: './employee-document-reject.component.html',
    styleUrls: ['./employee-document-reject.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeDocumentRejectComponent implements OnInit {
  userDocumentID:number;

  @ViewChild('reject') reject: NgForm;
  @ViewChild('closelgModal2') closelgModal2: ElementRef;
  @ViewChild('lgModal2') lgModal2: any;

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
    this.userDocumentID = data
  }
  alertVerifyConfirmation(userDocumentID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to verify this user Document details?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Verify',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userDocumentID: userDocumentID,
          verifyStatus: '1', // Verify status
          verifyBy: localStorage.getItem('id'),
        };
        this.spinner.start();
        this.api.callApi(this.constant.DOCVERIFYREQ, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
              this.ngOnInit();
              this.spinner.stop();
            }, 3000);
          },
          (err) => {
            this.notifications.create('Error', err.error.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          },
        );
      }
    });
  }

  rejectSubmit() {
    if (!this.reject.valid) {
      return;
    }
    const rejectBody = {
      userDocumentID: this.userDocumentID,
      verifyStatus: '2', // Reject status
      verifyBy: localStorage.getItem('id'),

      rejectionRemarks:  this.reject.value.remarks,
    }

    // this.rejectBody.rejectionRemarks = this.reject.value.remarks;
    this.spinner.start();
    this.api
      .callApi(this.constant.DOCVERIFYREQ,rejectBody, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.ngOnInit();
            this.closelgModal2.nativeElement.click();
            this.reject.resetForm();
            this.spinner.stop();
          }, 1000);
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

}
