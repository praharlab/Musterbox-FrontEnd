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
    selector: 'app-job-posting-data',
    templateUrl: './job-posting-data.component.html',
    styleUrls: ['./job-posting-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class JobPostingDataComponent implements OnInit {
  ipAddress: any;
  editData: any = [];
  appURL = environment.appUrl3;
  showForm: boolean;
  apiURL = environment.apiUrl;
  imgShow: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getJobPostData();
    this.getIPAddress();
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getJobPostData() {
    let queryString = `?secretKey=${this.activatedRoute.snapshot.params.id}`;
    this.spinner.start('get');
    this.api
      .callApi(this.constant.GETJOBPOSTBYSECRETKEY + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          this.showForm = true;
          this.validateCompanyLogo(this.editData.companyMaster.companyLogo)
          this.spinner.stop('get');
        },
        (err) => {
          this.spinner.stop('get');
          this.handleError(err.error.message);
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

  validateCompanyLogo(companyLogo: string) {
    const img = new Image();
    img.src = this.apiURL + 'uploads/company/logo/' + companyLogo;
    if (img.complete) {
      this.imgShow = true;
    } else {
      img.onload = () => {
        this.imgShow = true;
      };

      img.onerror = () => {
        this.imgShow = false;
      };
    }
  }
}
