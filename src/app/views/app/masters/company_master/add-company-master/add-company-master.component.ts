import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-company-master',
    templateUrl: './add-company-master.component.html',
    styleUrls: ['./add-company-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddCompanyMasterComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  file2: any;
  file3: any;
  format: any;
  url: any;
  ipAddress: any;
  companytype: any = [];
  ctype: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employeecodetype: any;
  adminRoot = environment.adminRoot;
  companyServicestatus: any;
  uploadFile_Type: string = "mobileNumber"
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getallcountry();
    this.getIPAddress();
    this.getcompanytype();
    this.getCompanyServiceStatusData();
  }

  getcompanytype() {
    const body = {
      page: '',
      limit: '',
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETACTIVECOMPANYTYPEDATA, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.companytype = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start('country');
    this.api.callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.country = res.data;
          this.spinner.stop('country');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('country');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('country');
      },
    );
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const file = event.target.files[0];
      const fileMimeType = file.type;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (allowedMimeTypes.includes(fileMimeType)) {
        if (file.size <= maxSizeInBytes) {
          this.file = file;
        } else {
          event.target.value = '';
          this.handleError(`File Size is more then 5mb.`);
        }
      } else {
        event.target.value = '';
        this.handleError(`Only jpeg, jpg, png are allowed.File ${file.name} has an invalid type. `);
      }
    }
  }

  onSelectFile2(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const file = event.target.files[0];
      const fileMimeType = file.type;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (allowedMimeTypes.includes(fileMimeType)) {
        if (file.size <= maxSizeInBytes) {
          this.file2 = file;
        } else {
          event.target.value = '';
          this.handleError(`File Size is more then 5mb.`);
        }
      } else {
        event.target.value = '';
        this.handleError(`Only jpeg, jpg, png are allowed.File ${file.name} has an invalid type. `);
      }
    }
  }

  onSelectFile3(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const file = event.target.files[0];
      console.log(file, 'file')
      const fileMimeType = file.type;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (allowedMimeTypes.includes(fileMimeType)) {
        if (file.size <= maxSizeInBytes) {
          this.file3 = file;
        } else {
          event.target.value = '';
          this.handleError(`File Size is more then 5mb.`);
        }
      } else {
        event.target.value = '';
        this.handleError(`Only jpeg, jpg, png are allowed.File ${file.name} has an invalid type. `);
      }
    }
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    this.spinner.start('submit');
    const formData = new FormData();
    formData.append('companyLogo', this.file);
    formData.append('authorizedSignature', this.file2);
    if (this.file3) {
      formData.append('letterHead', this.file3);
    }
    formData.append('companyName', this.addcomp.value.companyName);
    formData.append('companyAddress', this.addcomp.value.companyAddress);
    formData.append('companyWebsite', this.addcomp.value.companyWebsite);
    formData.append('companyEmail', this.addcomp.value.companyEmail);
    formData.append('companyTypeid', this.ctype);
    formData.append('cpName', this.addcomp.value.cpName);
    formData.append('cpMobileNo', this.addcomp.value.cpMobileNo);
    formData.append('cpEmail', this.addcomp.value.cpEmail);
    if (this.usertype == 2 || this.usertype == 3 || this.usertype == 4) {
      formData.append('parentCompanyMasterID', '0');
    } else {
      formData.append('parentCompanyMasterID', this.company_id);
    }
    formData.append('subCompanyRequired', '1');
    formData.append('employeeCodePattern', this.addcomp.value.employeeCodePattern);
    formData.append('employeeCodeType', this.addcomp.value.employeeCodeType);

    formData.append('panNumber', this.addcomp.value.panNumber);
    formData.append('tanNumber', this.addcomp.value.tanNumber);
    formData.append('cinNumber', this.addcomp.value.cinNumber);

    formData.append('expenseDatePicker', this.addcomp.value.ExpeneDatePicker);
    formData.append('status', '1');
    formData.append('cityMasterID', this.finalcityid);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('otp', this.addcomp.value.otp);
    formData.append('companyDescription', this.addcomp.value.companyDescription);

    formData.append('ownerName', this.addcomp.value.ownerName ? this.addcomp.value.ownerName : '');

    formData.append('ownerFatherName', this.addcomp.value.ownerFatherName ? this.addcomp.value.ownerFatherName : '');
    formData.append('tdsdeduction', this.addcomp.value.tdsdeduction);
    formData.append('fileUploadType', this.addcomp.value.fileUploadType);
    formData.append('setUpTime', this.addcomp.value.setUpTime);
    formData.append('CompanyServiceStatusID', this.addcomp.value.companyservicestatus);


    this.api.callApi(this.constant.CREATECOMPANYDATA, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/company_master']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
          this.buttonDisabled = false;
          this.buttonState = '';
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
        this.buttonDisabled = false;
        this.buttonState = '';
      },
    );
  }

  selectcountry(country: any) {
    if (!country) {
      return;
    }
    this.spinner.start('selectstate');
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
          this.spinner.stop('selectstate');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('selectstate');
        },
      );
  }

  selectstate(state: any) {
    this.spinner.start('selectstate');
    this.api
      .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.city = res.data;
          this.spinner.stop('selectstate');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('selectstate');
        },
      );
  }
  selectcity(city: any) {
    this.finalcityid = city;
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectcompanytype(ev: any) {
    this.ctype = ev;
  }

  employeeCodetype(event) {
    this.employeecodetype = event;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getCompanyServiceStatusData() {
    const body = {
      page: 1,
      limit: 10,
      searchQuery: '',
    }
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETCOMPANYSERVICESSTATUS, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.companyServicestatus = res.data;
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




}
