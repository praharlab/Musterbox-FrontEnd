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
    selector: 'app-add-module-details',
    templateUrl: './add-module-details.component.html',
    styleUrls: ['./add-module-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddModuleDetailsComponent implements OnInit {
  @ViewChild('addModuleDetails') addModuleDetails: NgForm;
  buttonDisabled = false;
  buttonState = '';
  ipAddress: any;
  activatedRoute: any;
  // modulename1: any = '';
  allmodulename: any;
  moduleId: any;
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
    this.getIPAddress();
    this.getmodule();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getmodule() {
    const body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLMODULE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allmodulename = res.data;
          this.spinner.stop();
        }
      });
  }

  selectmodule(ev: any) {
    this.moduleId = ev;
  }

  onSubmit() {
    if (!this.addModuleDetails.valid) {
      return;
    }
    let body;
    body = {
      moduleId: this.addModuleDetails.value.moduleId,
      FAQs: this.addModuleDetails.value.FAQs,
      Description: this.addModuleDetails.value.Description,
      status: '1',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEMODULEDETAILS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/Module_details']);

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
}
