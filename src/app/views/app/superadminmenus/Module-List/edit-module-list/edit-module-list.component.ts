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
    selector: 'app-edit-module-list',
    templateUrl: './edit-module-list.component.html',
    styleUrls: ['./edit-module-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditModuleListComponent implements OnInit {
  @ViewChild('editModule') editModule: NgForm;
  buttonDisabled = false;
  buttonState = '';
  ipAddress: any;
  moduleListData: any = {};
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
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  editdata() {
    let moduleId = this.formValue.ModuleListComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.VIEWMODULELIST + moduleId, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.moduleListData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  onSubmit() {
    if (!this.editModule.valid) {
      return;
    }
    let body;
    body = {
      moduleId: this.formValue.ModuleListComponent.id,
      moduleName: this.editModule.value.moduleName,
      status: '1',
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEMODULELIST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/Module_list']);
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
