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
    selector: 'app-edit-company-contact',
    templateUrl: './edit-company-contact.component.html',
    styleUrls: ['./edit-company-contact.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditCompanyContactComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  companydata: any = [];
  isadmins: any;
  allRoles: any = [];
  showRole: boolean = false;
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

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getIPAddress();
    this.editdata();
  }
  editdata() {
    let userMasterID = this.formValue.ListCompanyContactComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userMasterID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.spinner.stop('edit');
          this.companydata = res.data;

          let body = {
            companyMasterID: this.companydata.companyMasterId,
          };
          this.spinner.start('allroles');
          this.api.callApi(this.constant.LISTROLEMASTER, body, 'POST', true, true, true).subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.allRoles = res.data;
                this.showRole = true;
              } else {
                this.handleError(res.message);
              }
              this.spinner.stop('allroles');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('allroles');
            },
          );
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('edit');
        },
      );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body;
    this.addcomp.value.middleNAme = this.addcomp.value.middleNAme ? this.addcomp.value.middleNAme : ''

    if (this.addcomp.value.isadmin == '') {
      body = {
        userMasterID: this.formValue.ListCompanyContactComponent.id,
        firstName: this.addcomp.value.firstNAme,
        middleName: this.addcomp.value.middleNAme ? this.addcomp.value.middleNAme : null,
        lastName: this.addcomp.value.lastNAme,
        displayName:
          this.addcomp.value.firstNAme +
          ' ' +
          this.addcomp.value.middleNAme +
          ' ' +
          this.addcomp.value.lastNAme,
        userNumber: this.addcomp.value.contactNumber,
        companyMasterID: this.formValue.ListCompanyContactComponent.id, //not use in back-end
        password: this.addcomp.value.password,
        email: this.addcomp.value.email,
        status: '1',
        roleMasterID: this.addcomp.value.role,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
        admin: '0',
      };
    } else {
      body = {
        userMasterID: this.formValue.ListCompanyContactComponent.id,
        firstName: this.addcomp.value.firstNAme,
        middleName: this.addcomp.value.middleNAme ? this.addcomp.value.middleNAme : null,
        lastName: this.addcomp.value.lastNAme,
        userNumber: this.addcomp.value.contactNumber,
        displayName:
          this.addcomp.value.firstNAme +
          ' ' +
          this.addcomp.value.middleNAme +
          ' ' +
          this.addcomp.value.lastNAme,
        companyMasterID: this.formValue.ListCompanyContactComponent.id, //not use in back-end
        password: this.addcomp.value.password,
        email: this.addcomp.value.email,
        status: '1',
        roleMasterID: this.addcomp.value.role,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
        admin: '1',
      };
    }
    this.spinner.start('submit');
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
              this.router.navigate([this.adminRoot + '/masters/company_contact']);
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.handleError('Something Went Wrong!');
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
  prev() {
    this.router.navigate([this.adminRoot + '/masters/company_contact']);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
