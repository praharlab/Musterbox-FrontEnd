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
    selector: 'app-add-letter-fields',
    templateUrl: './add-letter-fields.component.html',
    styleUrls: ['./add-letter-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddLetterFieldsComponent implements OnInit {
  @ViewChild('addfields') addfields: NgForm;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  letter: any;
  usertype: any;
  lettertype_id: any;
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
    this.lettertype_id = localStorage.getItem('lettertype_id');
    this.childfields = localStorage.getItem('childfields') === 'false'; // Convert to boolean

    this.getIPAddress();
    this.getlettertype();
  }
  getlettertype() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETLETTERTEMPLATETYPEDATA, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.letter = res.data;
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onSubmit() {
    if (!this.addfields.valid) {
      return;
    }

    let body;

    if (this.childfields) {
      // No need to compare with 'true', as it is already a boolean
      body = {
        letterFieldsname: this.addfields.value.fields,
        letterTypeID: this.addfields.value.lettertype,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        letterFieldsname: this.addfields.value.fields,
        letterTypeID: this.addfields.value.lettertype,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }

    this.spinner.start('submit');
    this.api.callApi(this.constant.ADDLETTERFIELDS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/letter_fields']);
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
}
