import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-short-leave-application',
    templateUrl: './add-short-leave-application.component.html',
    styleUrls: ['./add-short-leave-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddShortLeaveApplicationComponent implements OnInit {
  @ViewChild('addShortLeave') addShortLeave: NgForm;
  adminRoot = environment.adminRoot;
  maxDate: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Subtract one day
    this.maxDate = yesterday.toISOString().split('T')[0];
  }

  onSubmit() {
    if (!this.addShortLeave.valid) return;
    const body = {
      userMasterIDs: [JSON.parse(localStorage.getItem('id'))],
      date: this.addShortLeave.value.date,
      remarks: this.addShortLeave.value.remarks,
    };

    this.spinner.start('add');
    this.api
      .callApi(this.constant.CREATESHORTLEAVEAPPLICATION, body, 'POST', true, true, true)
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
              this.router.navigate([this.adminRoot + '/attendances/my-short-leave-application']);
              this.spinner.stop('add');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });

            this.spinner.stop('add');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        },
      );
  }
}
