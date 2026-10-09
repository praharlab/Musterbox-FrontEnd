import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-add-mail-fields',
    templateUrl: './add-mail-fields.component.html',
    styleUrls: ['./add-mail-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMailFieldsComponent implements OnInit {
  @ViewChild('addfields') addfields: NgForm;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  mail: any;
  usertype: any;
  mailtype_id: any;
  childfields: boolean;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.mailtype_id = localStorage.getItem('mailtype_id');
    this.childfields = localStorage.getItem('childfields') === 'false'; // Convert to boolean

    this.getIPAddress();
    this.getmailtype();
  }
  getmailtype() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETMAILTEMPLATETYPEDATA, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.mail = res.data;
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  onSubmit() {
    if (!this.addfields.valid) {
      return;
    }

    let body;
    if (this.childfields) {
      // No need to compare with 'true', as it is already a boolean
      body = {
        mailfields_name: this.addfields.value.fields,
        mailTypeID: this.addfields.value.mailtype,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        mailfields_name: this.addfields.value.fields,
        mailTypeID: this.addfields.value.mailtype,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }

    this.spinner.start('submit');
    this.api.callApi(this.constant.ADDMAILFIELDS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/mail_fields']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
