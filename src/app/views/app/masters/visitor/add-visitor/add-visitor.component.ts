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
    selector: 'app-add-visitor',
    templateUrl: './add-visitor.component.html',
    styleUrls: ['./add-visitor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddVisitorComponent implements OnInit {
  @ViewChild('addvisitor') addvisitor: NgForm;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  image: null;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
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

  onSubmit() {
    if (!this.addvisitor.valid) {
      return;
    }

    const formData = new FormData();
    if (this.childcompany == 'false') {
      formData.append('visitorsFirstName', this.addvisitor.value.visitorsFirstName);
      formData.append('visitorsLastName', this.addvisitor.value.visitorsLastName);
      formData.append('visitorsPhone', this.addvisitor.value.visitorsPhone);
      formData.append('visitorsComapny', this.addvisitor.value.visitorsComapny);
      formData.append('companyMasterID', this.addvisitor.value.companyMasterID);
      if (this.image) {
        formData.append('visitorPhoto', this.image);
      }
      formData.append('status', '1');
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);
    } else {
      formData.append('visitorsFirstName', this.addvisitor.value.visitorsFirstName);
      formData.append('visitorsLastName', this.addvisitor.value.visitorsLastName);
      formData.append('visitorsPhone', this.addvisitor.value.visitorsPhone);
      formData.append('visitorsComapny', this.addvisitor.value.visitorsComapny);
      formData.append('companyMasterID', localStorage.getItem('company_id'));
      if (this.image) {
        formData.append('visitorPhoto', this.image);
      }
      formData.append('status', '1');
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);
    }
    this.spinner.start();

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEVISITOR, formData, 'POST', true, true, true).subscribe(
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
