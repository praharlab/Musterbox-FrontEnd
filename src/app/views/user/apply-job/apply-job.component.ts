import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-apply-job',
    templateUrl: './apply-job.component.html',
    styleUrls: ['./apply-job.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ApplyJobComponent implements OnInit {
  @ViewChild('applyJob') applyJob: NgForm;

  ipAddress: any;
  editData: any = [];
  appURL = environment.appUrl3;
  showForm: boolean;
  reponseMessage: any
  file: any;
  format: any;
  url: any;
  apiURL = environment.apiUrl;
  imgShow: boolean = false;
  countryData: any = [];
  selectedCountryCode: any = null
  showCountryCodeSelected: boolean = labelUtils.showCountryCodeSelected

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
    this.getallcountry()
    this.getIPAddress();
    if (this.showCountryCodeSelected) {
      this.selectedCountryCode = 103 //Default Selected India for SalaryPatra
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.countryData = res.data;
          this.spinner.stop();
        }
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


  onSubmit() {
    if (!this.applyJob.valid) {
      return;
    }
    const formData = new FormData();
    formData.append('firstName', this.applyJob.value.firstName);
    formData.append('middleName', this.applyJob.value.middleName);
    formData.append('lastName', this.applyJob.value.lastName);
    formData.append('userNumber', this.applyJob.value.userNumber);
    formData.append('email', this.applyJob.value.email);
    formData.append('candidateComment', this.applyJob.value.candidateComment);
    formData.append('resumeAttachment', this.file);
    formData.append('companyMasterID', this.editData.companyMasterID);
    formData.append('branchMasterID', this.editData.branchMasterID);
    formData.append('departmentId', this.editData.departmentId);
    formData.append('designationId', this.editData.designationId);
    formData.append('secretKey', this.editData.secretKey);
    formData.append('jobPostingID', this.editData.jobPostingID);
    formData.append('userNumberCountryMasterID', this.applyJob.value.userNumberCountryMasterID);
    this.spinner.start();
    this.api
      .callApi(this.constant.ADDJOBAPPLICATION, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.reponseMessage = res.message
            this.showForm = false;
            setTimeout(() => {
              this.applyJob.resetForm();
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
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;
    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      } else if (this.file.type.indexOf('pdf') > -1) {
        this.format = 'pdf';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }

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
