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
    selector: 'app-edit-tds-section',
    templateUrl: './edit-tds-section.component.html',
    styleUrls: ['./edit-tds-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTdsSectionComponent implements OnInit {
  @ViewChild('editTdsSection') editTdsSection: NgForm;
  ipAddress: any;
  getTdsSectionData: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = Number(localStorage.getItem('company_id'));
    this.getIPAddress();
    this.getData();
  }

  getData() {
    let id = this.formValue.ListTdsSectionComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETBYIDTDSSECTION + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.getTdsSectionData = res.data;
          this.spinner.stop('edit');
        }else{
          this.spinner.stop('edit');
          this.handleError(res.message);
        }
      },  (err) => {
        this.spinner.stop('edit');
        this.handleError(err.error.message);
      },);
  }

  onSubmit() {
    if (!this.editTdsSection.valid) {
      return;
    }

    let id = this.formValue.ListTdsSectionComponent.id;

    let body = {
      tdsSectionName: this.editTdsSection.value.tdsSectionName,
      tdsSectionDescription: this.editTdsSection.value.tdsSectionDescription,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.UPDATETDSSECTION + id, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_section']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.handleError(err.error.message);
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
    this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_section']);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

}
