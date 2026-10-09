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
    selector: 'app-add-dealer-plan',
    templateUrl: './add-dealer-plan.component.html',
    styleUrls: ['./add-dealer-plan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddDealerPlanComponent implements OnInit {
  @ViewChild('addsubadmin') addsubadmin: NgForm;
  ipAddress: any;
  company_id: any;
  product: any;
  adminRoot = environment.adminRoot;

  showPassword: boolean = false;
  values = [
    {
      featuresName: '',
      isDeleted: false,
    },
  ];
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    // public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getIPAddress();
  }
  onSubmit() {
    if (!this.addsubadmin.valid) {
      return;
    }

    const values = this.values
      .filter((e) => !e.isDeleted)
      .map((e) => ({
        featuresName: e.featuresName,
      }));

    let featuresString = values.map((item) => item.featuresName).join('<br>');


    let body = {
      planName: this.addsubadmin.value.planName,
      Description: this.addsubadmin.value.Description,
      numberOfEmployee: this.addsubadmin.value.numberOfEmployee,
      numberOfCompany: this.addsubadmin.value.numberOfCompany,
      features: featuresString
    };

    this.spinner.start('submit');
    this.api.callApi(this.constant.ADDDEALERPLAN, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/dealerplan']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  removevalue(i: number) {
    this.values[i].isDeleted = true;
  }

  addvalue() {
    this.values.push({ featuresName: '', isDeleted: false });
  }
}

