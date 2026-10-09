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
import { Lightbox } from 'ngx-lightbox';
import { CompanyLogoService } from 'src/app/services/company-logo.service';

@Component({
    selector: 'app-edit-company-master',
    templateUrl: './edit-company-master.component.html',
    styleUrls: ['./edit-company-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditCompanyMasterComponent implements OnInit {
  @ViewChild('editcomp') editcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  file2: any;
  file3: any;
  format: any;
  url: any;
  url2: any;
  ipAddress: any;
  companydata: any;
  cityid: any;
  stateid: any;
  countryid: any;
  apiURL = environment.apiUrl;
  editImag: string | ArrayBuffer;
  companytype: any;
  ctype: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employeecodetype: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, {
      centerVertically: true,
      positionFromTop: 0,
      disableScrolling: true,
      wrapAround: true,
    });
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getallcountry();
    this.getIPAddress();
    this.editdata();
    this.getcompanytype();
  }
  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private lightbox: Lightbox,
    private companyLogoService: CompanyLogoService
  ) { }
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

  editdata() {
    let companyid = this.formValue.ListCompanyMasterComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          this.employeecodetype = this.companydata.employeeCodeType;
          this.countryid = this.companydata['cityMaster.stateMaster.countryMaster.countryMasterID'];
          this.selectcountry(this.countryid);
          this.stateid = this.companydata['cityMaster.stateMaster.stateMasterID'];
          this.selectstate(this.stateid);
          this.cityid = this.companydata['cityMaster.cityMasterID'];

          this.ctype = this.companydata.companyTypeid;
          this.spinner.stop('edit');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('edit');
        },
      );
  }

  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.country = res.data;
        }
      });
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

  // onSelectFile(event: any) {
  //   let filename = event.target.files[0].name;

  //   let ext = filename.substring(filename.lastIndexOf('.') + 1);
  //   if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
  //     this.notifications.create(
  //       'Error',
  //       'Selected file format is not supported!!',
  //       NotificationType.Bare,
  //       { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
  //     );
  //   } else {
  //     this.file = event.target.files && event.target.files[0];
  //     if (this.file) {
  //       var reader = new FileReader();
  //       reader.readAsDataURL(this.file);
  //       if (this.file.type.indexOf('image') > -1) {
  //         this.format = 'image';
  //       } else if (this.file.type.indexOf('video') > -1) {
  //         this.format = 'video';
  //       }
  //       reader.onload = (event) => {
  //         this.url = (<FileReader>event.target).result;
  //       };
  //     }
  //   }
  // }

  // onSelectFile2(event: any) {
  //   let filename = event.target.files[0].name;

  //   let ext = filename.substring(filename.lastIndexOf('.') + 1);
  //   if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
  //     this.notifications.create(
  //       'Error',
  //       'Selected file format is not supported!!',
  //       NotificationType.Bare,
  //       { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
  //     );
  //   } else {
  //     this.file2 = event.target.files && event.target.files[0];
  //     if (this.file2) {
  //       var reader = new FileReader();
  //       reader.readAsDataURL(this.file2);
  //       if (this.file2.type.indexOf('image') > -1) {
  //         this.format = 'image';
  //       } else if (this.file2.type.indexOf('video') > -1) {
  //         this.format = 'video';
  //       }
  //       reader.onload = (event) => {
  //         this.url2 = (<FileReader>event.target).result;
  //       };
  //     }
  //   }
  // }
  onSubmit() {
    if (!this.editcomp.valid) {
      return;
    }

    this.spinner.start('submit');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    const formData = new FormData();
    formData.append('companyMasterID', this.formValue.ListCompanyMasterComponent.id);
    if (this.file) {
      formData.append('companyLogo', this.file);
    }
    if (this.file2) {
      formData.append('authorizedSignature', this.file2);
    }
    if (this.file3) {
      formData.append('letterHead', this.file3);
    }
    formData.append('companyName', this.editcomp.value.companyName);
    formData.append('companyAddress', this.editcomp.value.companyAddress);
    formData.append('companyWebsite', this.editcomp.value.companyWebsite);
    formData.append('companyEmail', this.editcomp.value.companyEmail);
    formData.append('companyTypeid', this.ctype);
    formData.append('cpName', this.editcomp.value.cpName);
    formData.append('cpMobileNo', this.editcomp.value.cpMobileNo);
    formData.append('cpEmail', this.editcomp.value.cpEmail);
    formData.append('panNumber', this.editcomp.value.panNumber);
    formData.append('tanNumber', this.editcomp.value.tanNumber);
    formData.append('cinNumber', this.editcomp.value.cinNumber);

    formData.append('parentCompanyMasterID', this.company_id);
    formData.append('subCompanyRequired', '0');
    formData.append('employeeCodePattern', this.editcomp.value.employeeCodePattern);
    formData.append('employeeCodeType', this.editcomp.value.employeeCodeType);

    formData.append('expenseDatePicker', this.editcomp.value.ExpeneDatePicker);
    formData.append('status', '1');
    formData.append('cityMasterID', this.cityid);
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('otp', this.editcomp.value.otp);
    formData.append('updateByIp', this.ipAddress);
    formData.append('companyDescription', this.editcomp.value.companyDescription);
    formData.append('ownerName', this.editcomp.value.ownerName ? this.editcomp.value.ownerName : '');

    formData.append('ownerFatherName', this.editcomp.value.ownerFatherName ? this.editcomp.value.ownerFatherName : '');
    formData.append('tdsdeduction', this.editcomp.value.tdsdeduction);
    formData.append('fileUploadType', this.editcomp.value.fileUploadType);
    formData.append('uniqueEmpCode', this.editcomp.value.uniqueEmpCode);
    formData.append('setUpTime', this.editcomp.value.setUpTime);


    this.api.callApi(this.constant.UPDATEOMPANYDATA, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          res.data.companyLogo ? this.companyLogoService.setCompanyLogo(res.data.companyLogo) : this.companyLogoService.setCompanyLogo('');
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
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('submit');
      },
    );
  }
  selectcountry(country: any) {
    if (!country) {
      return;
    }
    this.spinner.start('selectcountry');
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
          this.spinner.stop('selectcountry');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('selectcountry');
        },
      );
    this.stateid = null;
    this.cityid = null;
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
    this.cityid = city;
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

  deleteCompanyLogo() {
    this.spinner.start('submit');
    const body = {
      companyMasterID: this.formValue.ListCompanyMasterComponent.id,
      imageType: 'companyLogo'
    };

    this.api.callApi(this.constant.REMOVECOMPANYLOGOANDAUTHSIGN, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.companyLogoService.setCompanyLogo('')
          setTimeout(() => {
            this.ngOnInit();
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
  }

  deleteAuthorizedSignature() {
    this.spinner.start('submit');
    const body = {
      companyMasterID: this.formValue.ListCompanyMasterComponent.id,
      imageType: 'authorizedSignature'
    };

    this.api.callApi(this.constant.REMOVECOMPANYLOGOANDAUTHSIGN, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.ngOnInit();
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
  }

  deleteLetterHead() {
    this.spinner.start('submit');
    const body = {
      companyMasterID: this.formValue.ListCompanyMasterComponent.id,
      imageType: 'letterHead'
    };

    this.api.callApi(this.constant.REMOVECOMPANYLOGOANDAUTHSIGN, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.ngOnInit();
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
  }
}
