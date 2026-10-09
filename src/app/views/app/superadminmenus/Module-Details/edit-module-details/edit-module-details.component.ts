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
    selector: 'app-edit-module-details',
    templateUrl: './edit-module-details.component.html',
    styleUrls: ['./edit-module-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditModuleDetailsComponent implements OnInit {
  @ViewChild('EditModuleDetails') EditModuleDetails: NgForm;
  moduleDetailsData: any = {};
  buttonDisabled = false;
  buttonState = '';
  ipAddress: any;
  allmodulename: any;
  moduleId: any;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    
    this.getIPAddress();
    this.getmodule();
    this.editdata();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectmodule(ev: any) {
    this.moduleId = ev;
  }

  editdata() {
    let moduleDetailsID = this.formValue.ModuleDetailsComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWMODULEDETAILS + moduleDetailsID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.moduleDetailsData = res.data;
          this.spinner.stop();
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
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
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },);
  }

  onSubmit() {
    if (!this.EditModuleDetails.valid) {
      return;
    }
    let body;
    body = {
      moduleDetailsID: this.formValue.ModuleDetailsComponent.id,
      moduleId: this.EditModuleDetails.value.moduleId,
      FAQs: this.EditModuleDetails.value.FAQs,
      Description: this.EditModuleDetails.value.Description,
      status: '1',
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEMODULEDETAILS, body, 'POST', true, true, true).subscribe(
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
          this.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

}
