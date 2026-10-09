import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';


Size.whitelist = [
  '8px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '44px',
  '46px',
  '48px',
  '50px',
];
Quill.register(Size, true);

let Font = Quill.import('formats/font');
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial', 'calibri'];
Quill.register(Font, true);
@Component({
    selector: 'app-mail-template',
    templateUrl: './mail-template.component.html',
    styleUrls: ['./mail-template.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MailTemplateComponent implements OnInit {
  @ViewChild('mailtemp') mailtemp: NgForm;
  adminRoot = environment.adminRoot;

  file: any;
  format: any;
  url: any;
  ipAddress: any;
  mail: any;
  usertype: any;
  mailtype_id: any;
  childfields: boolean;
  company_id: string;
  cid: string;
  childcompany: string;
  company1: any;
  employee: any;
  selected3: any[];
  permissiondelete: any;
  permissionedit: any;
  permissionview: any;
  permissioncreate: any;
  isdisabled: boolean;
  mailfields: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }
  ngOnInit(): void {
    this.mailtype_id = localStorage.getItem('mailtype_id');
    this.childfields = localStorage.getItem('childfields') === 'false'; // Convert to boolean
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();
    this.getmailtype();
    this.getcompany();
  }

  getmailtype() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETMAILTEMPLATETYPEDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.mail = res.data;


          this.spinner.stop();
        }
      });
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
          this.company1 = res.data;
          this.spinner.stop();
        }
      });
  }

  getfields(id) {
    if (id == undefined) {
      this.mailfields = [];
    } else {
      let body = {
        mailtypeid: id,
        page: '',
        limit: '',
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLMAILTEMPLATETYPEBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.mailfields = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  onSubmit() {

    if (!this.mailtemp.valid) return;

    let body = {
      companyMasterID: this.mailtemp.value.company,
      mailTypeID: this.mailtemp.value.mailtype,
      subject: this.mailtemp.value.subject,
      body: this.mailtemp.value.temp,
      status: 1,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api.callApi(this.constant.ADDMAILTEMPLATE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isdisabled = true;
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/utilitys/Mail-Template-List']);
            this.spinner.stop();
          }, 3000);

          // window.location.reload();
          // this.spinner.stop();
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

  selectcompany(id) {
    if (id == undefined) {
      this.mailtemp.resetForm();
      return;
    }

    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          let data1 = [];
          this.employee.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected3 = data1;
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

}
