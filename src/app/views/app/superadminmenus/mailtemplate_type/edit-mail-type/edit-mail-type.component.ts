import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
@Component({
    selector: 'app-edit-mail-type',
    templateUrl: './edit-mail-type.component.html',
    styleUrls: ['./edit-mail-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditMailTypeComponent implements OnInit {
  @ViewChild('addmail') addmail: NgForm;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  maildata: any = [];
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.editdata();
  }
  editdata() {
    let mailid = this.formValue.ListMailTypeComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.VIEWMAILTYPEDATA + mailid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.maildata = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('edit');
        },
      );
  }
  onSubmit() {
    if (!this.addmail.valid) {
      return;
    }
    let body = {
      mailTypeID: this.formValue.ListMailTypeComponent.id,
      mailTypename: this.addmail.value.mailTypename,
      status: '1',
      upateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATEMAILTYPEDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/mailTemplate_type']);
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
