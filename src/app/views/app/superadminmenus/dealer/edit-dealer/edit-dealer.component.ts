import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-dealer',
    templateUrl: './edit-dealer.component.html',
    styleUrls: ['./edit-dealer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditDealerComponent implements OnInit {
  @ViewChild('editsubadmin') editsubadmin: NgForm;
  ipAddress: any;
  companydata: any = [];
  isadmins: any;
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
    let userid = this.formValue.ListDealerComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop();
          this.companydata = res.data;
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
  onSubmit() {
    if (!this.editsubadmin.valid) {
      return;
    }
    let body;

    body = {
      userMasterID: this.formValue.ListDealerComponent.id,
      firstName: this.editsubadmin.value.firstNAme,
      middleName: this.editsubadmin.value.middleNAme,
      lastName: this.editsubadmin.value.lastNAme,
      displayName:
        this.editsubadmin.value.firstNAme +
        ' ' +
        this.editsubadmin.value.middleNAme +
        ' ' +
        this.editsubadmin.value.lastNAme,
      userNumber: this.editsubadmin.value.contactNumber,
      password: this.editsubadmin.value.password,
      email: this.editsubadmin.value.email,
      status: '1',
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
      admin: 4,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATECOMPANYCONTACTDATA, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/superadminmenus/list_dealer']);
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
