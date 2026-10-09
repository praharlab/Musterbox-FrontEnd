import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
    selector: 'app-add-tds-subsection',
    templateUrl: './add-tds-subsection.component.html',
    styleUrls: ['./add-tds-subsection.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTdsSubsectionComponent implements OnInit {
  @ViewChild('addTdsSubSection') addTdsSubSection: NgForm;
  ipAddress: any;
  tdsSectionData: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  tdsSubSectionCategory: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getIPAddress();
    this.getTDSSection();
    this.getTDSSubSectioCategory();
  }

  getTDSSubSectioCategory(){
    this.spinner.start('category')
    this.api
    .callApi(this.constant.GETTDSSUBSECTIONCATEGORYLIST , {}, 'GET', true, false, true)
    .subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.tdsSubSectionCategory = res.data;
         
        }

        this.spinner.stop('category');
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('category');
      },
    );
  }

  getTDSSection() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLDATATDSSECTION, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tdsSectionData = res.data;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addTdsSubSection.valid) {
      return;
    }
    let body;

    body = {
      tdsSubSectionName: this.addTdsSubSection.value.tdsSubSectionName,
      tdsSubSectionDescription: this.addTdsSubSection.value.tdsSubSectionDescription,
      tdsSubSectionCategoryID:this.addTdsSubSection.value.tdsSubSectionCategoryID,
      tdsSectionID: this.addTdsSubSection.value.tdsSectionID,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.ADDTDSSUBSECTION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section']);
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
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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

  cancel() {
    this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section']);
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

}
