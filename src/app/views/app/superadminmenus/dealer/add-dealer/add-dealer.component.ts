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
    selector: 'app-add-dealer',
    templateUrl: './add-dealer.component.html',
    styleUrls: ['./add-dealer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddDealerComponent implements OnInit {
  @ViewChild('addsubadmin') addsubadmin: NgForm;
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
    if (!this.addsubadmin.valid) {
      return;
    }
    let body;

    body = {
      firstName: this.addsubadmin.value.firstNAme,
      middleName: this.addsubadmin.value.middleNAme,
      lastName: this.addsubadmin.value.lastNAme,
      displayName:
        this.addsubadmin.value.firstNAme +
        ' ' +
        this.addsubadmin.value.middleNAme +
        ' ' +
        this.addsubadmin.value.lastNAme,
      userNumber: this.addsubadmin.value.contactNumber,
      companyMasterID: 200,
      password: this.addsubadmin.value.password,
      email: this.addsubadmin.value.email,
      status: 1,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      admin:4,
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
            this.router.navigate([this.adminRoot + '/superadminmenus/list_dealer']);
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

