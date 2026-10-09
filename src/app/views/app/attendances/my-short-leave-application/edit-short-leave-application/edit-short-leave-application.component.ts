import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-short-leave-application',
    templateUrl: './edit-short-leave-application.component.html',
    styleUrls: ['./edit-short-leave-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditShortLeaveApplicationComponent implements OnInit {

  @ViewChild('editShortLeave') editShortLeave: NgForm;

  adminRoot = environment.adminRoot;
  shortLeaveData: any;
  formValue: any;
  maxDate: string

  constructor(
      private spinner: NgxUiLoaderService,
      private router: Router,
      public activatedRoute: ActivatedRoute,
      private notifications: AppNotificationService,
      private api: ApiService,
      private constant: ConstantService,
      private modalService: ModalService,
      private formValueStorageService: FormValueStorageService,  
    ) { }

  ngOnInit(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Subtract one day
    this.maxDate = yesterday.toISOString().split('T')[0];
    this.formValue = this.formValueStorageService.getData();
    this.getEditdata()
  }

  getEditdata() {
    this.spinner.start('getData');
    this.api
      .callApi(
        this.constant.GETSHORTLEAVEAPPLICATIONBYID + '/' + this.formValue.myShortLeaveApplication.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.shortLeaveData = res.data;
          this.spinner.stop('getData');
        },
        (err) => {
          this.spinner.stop('getData');
        },);

  }

  onSubmit() {
      if (!this.editShortLeave.valid) return
      const body = {
        date: this.shortLeaveData.date,
        remarks: this.shortLeaveData.remarks,
      }
      this.spinner.start('edit')
      this.api.callApi(this.constant.UPDATESHORTLEAVEAPPLICATION + '/' + this.formValue.myShortLeaveApplication.id, body, 'PUT', true, true, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.modalService.refreshUserRequestStatus();
              this.router.navigate([this.adminRoot + '/attendances/my-short-leave-application']);
              this.spinner.stop('edit');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('edit');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('edit');
        },
      );
    }
}
