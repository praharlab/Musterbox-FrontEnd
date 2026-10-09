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
    selector: 'app-edit-announcement',
    templateUrl: './edit-announcement.component.html',
    styleUrls: ['./edit-announcement.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAnnouncementComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  isdisabled = false;
  ipAddress: any;
  announcementData: any = [];
  company: any;
  element: any;
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

    this.getIPAddress();
    this.editdata();
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
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
  editdata() {
    let companyid = this.formValue.ListAnnouncementComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWANNOUNCEMENT + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.announcementData = res.data;
          this.element = <HTMLInputElement>document.getElementById('ann');
          this.element.value = this.announcementData.announcement;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
        },
      );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      announcementID: this.formValue.ListAnnouncementComponent.id,
      announcement: this.addcomp.value.announcement,
      announcementDate: this.addcomp.value.announcementDate,
      companyMasterID: this.addcomp.value.companyMasterID,
      upateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEANNOUNCEMENT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isdisabled = true;
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/announcement']);

            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
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
