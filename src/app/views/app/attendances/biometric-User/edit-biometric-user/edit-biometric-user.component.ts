import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
@Component({
    selector: 'app-edit-biometric-user',
    templateUrl: './edit-biometric-user.component.html',
    styleUrls: ['./edit-biometric-user.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditBiometricUserComponent implements OnInit {
  @ViewChild('adddata') adddata: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  apiURL = environment.apiUrl;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  category: any;
  user: any;
  salary: boolean;
  erpdata1: any;
  adminRoot = environment.adminRoot;
  values: any;
  formValue: any;
  biometricUserSerialNo1: any;
  image: null;
  serverIp: null;
  biometricData: any;

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
    this.biometricUserSerialNo1 = this.formValue.ListBiometricUserComponent.id;

    this.serverIp = this.formValue.BiometricListComponent.body.serverIp;
    this.getIPAddress();
    this.getEditData();
  }

  onFileChange(event: any) {

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    else this.image = null

  }

  getEditData() {
    const id = this.formValue.ListBiometricUserComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.BIOMETRICGETBYID + id, {}, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          this.biometricData = res.data;

          this.spinner.stop('start');
        },
        (err) => {
          this.spinner.stop('start');
          this.handleError(err.error.message);
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

  onSubmit() {
    if (!this.adddata.valid) {
      return;
    }

    const formData = new FormData();

    formData.append('enrollid', this.biometricData.enrollid);
    formData.append('biometricUserSerialNo', this.biometricData.biometricUserSerialNo);
    formData.append('biometricUserID', this.biometricData.biometricUserID);
    formData.append('isAdmin', this.adddata.value.isAdmin);
    formData.append('firstName', this.adddata.value.short);
    formData.append('lastName', this.adddata.value.cpn);
    formData.append('face', this.image || '');
    formData.append('serverIp', this.serverIp);
    formData.append('updateBy', localStorage.getItem('id'));

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.api.callApi(this.constant.EDITBIOMETRICUSER, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/attendances/list-biometricUser']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {

          this.buttonDisabled = false;
          this.notifications.create('Error', res.message || 'An unknown error occurred', NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        console.log(err, "err");

        // Extract error message if available
        const errorMessage = err?.error?.message || 'An unknown error occurred';

        this.buttonDisabled = false;
        this.notifications.create('Error', errorMessage, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
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
