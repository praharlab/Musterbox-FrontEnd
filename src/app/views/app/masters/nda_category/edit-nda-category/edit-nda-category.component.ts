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
    selector: 'app-edit-nda-category',
    templateUrl: './edit-nda-category.component.html',
    styleUrls: ['./edit-nda-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditNdaCategoryComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  ndacategorydata: any = [];
  comp: any;
  usertype: any;
  company_id: any;
  childcompany: string;
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

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.getIPAddress();
    this.editdata();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
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
    let ndaid = this.formValue.ListNdaCategoryComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETBYIDNDACATEGORY + ndaid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.ndacategorydata = res.data;
          this.spinner.stop('edit');
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

    if (this.childcompany == 'false') {
      body = {
        Ndacategoryid: this.formValue.ListNdaCategoryComponent.id,
        companyMasterID: this.addcomp.value.company,
        nda_category: this.addcomp.value.ndacategory,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    } else {
      body = {
        Ndacategoryid: this.formValue.ListNdaCategoryComponent.id,
        companyMasterID: localStorage.getItem('company_id'),
        nda_category: this.addcomp.value.ndacategory,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
      };
    }

    this.spinner.start();
    this.api.callApi(this.constant.UPDATENDACATEGORY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/nda_category']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
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
