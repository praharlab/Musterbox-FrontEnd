import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-superadmin',
    templateUrl: './add-superadmin.component.html',
    styleUrls: ['./add-superadmin.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddSuperadminComponent implements OnInit {
  @ViewChild('addsuperadmin') addsuperadmin: NgForm;
  ipAddress: any;
  company_id: any;
  product: any;
  adminRoot = environment.adminRoot;

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.getIPAddress();
  }

  onSubmit() {
    if (!this.addsuperadmin.valid) {
      return;
    }
    let body;

    body = {
      firstName: this.addsuperadmin.value.firstNAme,
      middleName: this.addsuperadmin.value.middleNAme,
      lastName: this.addsuperadmin.value.lastNAme,
      displayName:
        this.addsuperadmin.value.firstNAme +
        ' ' +
        this.addsuperadmin.value.middleNAme +
        ' ' +
        this.addsuperadmin.value.lastNAme,
      userNumber: this.addsuperadmin.value.contactNumber,
      companyMasterID: 11,
      password: this.addsuperadmin.value.password,
      email: this.addsuperadmin.value.email,
      status: 1,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      admin: '2',
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDCOMPANYCONTACTDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/superadmin']);

            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        }
        this.spinner.stop();
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
