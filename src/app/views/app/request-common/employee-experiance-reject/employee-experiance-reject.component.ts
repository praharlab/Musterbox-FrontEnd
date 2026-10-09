import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service'
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
    selector: 'app-employee-experiance-reject',
    templateUrl: './employee-experiance-reject.component.html',
    styleUrls: ['./employee-experiance-reject.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeExperianceRejectComponent implements OnInit {
  userExperienceID: number;
  @ViewChild('reject') reject: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') lgModal: any;
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
    this.userExperienceID = data
  }

  alertVerifyConfirmation(userExperienceID: any) {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to verify this user Experience details?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Verify',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userExperienceID:userExperienceID,
          verifyStatus: '1', // Verify status
          verifyBy: localStorage.getItem('id'),
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.EXPERIENCEVERIFYREQ, body, 'POST', true, true, true)
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
    });
  }

  rejectSubmit() {
    if (!this.reject.valid) {
      return;
    }
    const rejectBody = {
      userExperienceID: this.userExperienceID,
      verifyStatus: '2', // Reject status
      verifyBy: localStorage.getItem('id'),
      rejectionRemarks: this.reject.value.remarks,
    }
    this.spinner.start('loader');
    this.api
      .callApi(this.constant.EXPERIENCEVERIFYREQ, rejectBody, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
            }, 3000);
            this.closelgModal2.nativeElement.click();
            this.reject.resetForm();

            this.spinner.stop('loader');
          } else {
            this.handleCatchError();
            this.closelgModal2.nativeElement.click();
            this.reject.resetForm();
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


