import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-anonymous-feedback',
    templateUrl: './anonymous-feedback.component.html',
    styleUrls: ['./anonymous-feedback.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AnonymousFeedbackComponent implements OnInit {
  @ViewChild('feedbackForm') feedbackForm: NgForm;

  rows: any;

  constructor(
      private spinner: NgxUiLoaderService,
      private router: Router,
      public activatedRoute: ActivatedRoute,
      private notifications: AppNotificationService,
      private api: ApiService,
      private constant: ConstantService,
      private http: HttpClient,

  
    ) { }

  ngOnInit(): void {
  }

  AnonymousFeedback() {
  
      if (!this.feedbackForm || !this.feedbackForm.valid) {
        return;
      }
  
      const body = {
        feedback: this.feedbackForm.value.feedback, // Adjust if needed
        createBy: +localStorage.getItem('id'),
        userMasterID: localStorage.getItem('id'),
      };
  
      this.spinner.start();
      this.api.callApi(
        this.constant.ADDANONYMOUSFEEDBACK,
        body,
        'POST',
        true,
        false,
        true
      ).subscribe((res: any) => {
        if (res.status === 200) {
          this.rows = res.data;
          this.feedbackForm.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      });
    }

}
