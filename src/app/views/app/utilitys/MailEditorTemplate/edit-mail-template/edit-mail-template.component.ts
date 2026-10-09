import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
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
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial','calibri'];
Quill.register(Font, true);
@Component({
    selector: 'app-edit-mail-template',
    templateUrl: './edit-mail-template.component.html',
    styleUrls: ['./edit-mail-template.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditMailTemplateComponent implements OnInit {
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
  isdisabled: boolean;

  maildata1: any = [];
  mailfields: any = [];
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
    this.mailtype_id = localStorage.getItem('mailtype_id');
    this.childfields = localStorage.getItem('childfields') === 'false'; // Convert to boolean
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();
    this.getmailtype();
    this.getcompany();
    this.editdata();
  }

  editdata() {
    let mailTemplateID = this.formValue.MailTemplateListComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETTEMPLATEDATABYID + mailTemplateID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.maildata1 = res.data;

          this.getfields(this.maildata1.mailTypeID);

          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
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

  onSubmit() {

    if (!this.mailtemp.valid) return;


    let body = {
      mailTemplateID: this.formValue.MailTemplateListComponent.id,
      mailTypeID: this.mailtemp.value.mailtype,
      companyMasterID: this.mailtemp.value.company,
      subject: this.mailtemp.value.subject,
      body: this.mailtemp.value.temp,
      status: 1,
      upateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api.callApi(this.constant.EDITTEMPLATE, body, 'POST', true, true, true).subscribe(
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
