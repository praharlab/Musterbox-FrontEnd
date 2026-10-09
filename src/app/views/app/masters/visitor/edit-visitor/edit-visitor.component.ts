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
    selector: 'app-edit-visitor',
    templateUrl: './edit-visitor.component.html',
    styleUrls: ['./edit-visitor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditVisitorComponent implements OnInit {
  @ViewChild('addvisitor') addvisitor: NgForm;
  apiURL = environment.apiUrl;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  visitordata: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  image: null;
  oldImage: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }
  editdata() {
    let companyid = this.formValue.ListVisitorComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWVISITORDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.visitordata = res.data;
          this.oldImage = this.visitordata.visitorPhoto;
          this.spinner.stop();
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

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];
    } else {
      this.image = null;
    }
  }

  viewImage(viewPhoto: any) {
    window.open(this.apiURL + viewPhoto);
  }

  onSubmit() {
    if (!this.addvisitor.valid) {
      return;
    }

    const formData = new FormData();
    if (this.childcompany == 'false') {
      formData.append('visitorsid', this.formValue.ListVisitorComponent.id);
      formData.append('visitorsFirstName', this.addvisitor.value.visitorsFirstName);
      formData.append('visitorsLastName', this.addvisitor.value.visitorsLastName);
      formData.append('visitorsPhone', this.addvisitor.value.visitorsPhone);
      formData.append('visitorsComapny', this.addvisitor.value.visitorsComapny);
      formData.append('companyMasterID', this.addvisitor.value.companyMasterID);
      if (this.image) {
        formData.append('visitorPhoto', this.image);
      }
      formData.append('status', '1');
      formData.append('updateBy', localStorage.getItem('id'));
      formData.append('updateByIp', this.ipAddress);
    } else {
      formData.append('visitorsid', this.formValue.ListVisitorComponent.id);
      formData.append('visitorsFirstName', this.addvisitor.value.visitorsFirstName);
      formData.append('visitorsLastName', this.addvisitor.value.visitorsLastName);
      formData.append('visitorsPhone', this.addvisitor.value.visitorsPhone);
      formData.append('visitorsComapny', this.addvisitor.value.visitorsComapny);
      formData.append('companyMasterID', localStorage.getItem('company_id'));
      if (this.image) {
        formData.append('visitorPhoto', this.image);
      }
      formData.append('status', '1');
      formData.append('updateBy', localStorage.getItem('id'));
      formData.append('updateByIp', this.ipAddress);
    }
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.UPDATEVISITOR, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/visitor']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
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
