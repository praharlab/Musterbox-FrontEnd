import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-biometric-attendance-sync',
    templateUrl: './biometric-attendance-sync.component.html',
    styleUrls: ['./biometric-attendance-sync.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BiometricAttendanceSyncComponent implements OnInit {
  @ViewChild('biometric') biometric: NgForm;
  @ViewChild('importattendance') importattendance: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  company_id: any;
  usertype: string;
  childcompany: string;
  allcomp: any;
  permissionsync: any = [];
  ipAddress: any;
  company1: any;
  month: any;
  file: any;
  file1: any;
  disable: boolean = false;
  format: string;
  url: string | ArrayBuffer;

  constructor(
    private notifications: AppNotificationService,
    private spinner: NgxUiLoaderService,
    private http: HttpClient,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.getcompany();
    this.company_id = +localStorage.getItem('company_id');

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.getIPAddress();
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionsync = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BiometricAttendance' &&
              permissionval.operationName.includes('Download')
            );
          });
          this.spinner.stop();
        }
      });
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
          this.allcomp = res.data;

          this.spinner.stop();
        }
      });
  }
  sync() {
    if (!this.biometric.valid) {
      return;
    }

    this.spinner.start('sync');

    const body = {
      companyMasterID: this.biometric.value.company,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    let apiPath = this.constant.SYNCATTENDANCE, method = 'POST';
    if (+this.biometric.value.company == 364) {
      apiPath = this.constant.HEERAGROUPBIOMETRICSYNC;
      method = 'GET';
    }

    this.api
      .callBiometricApi(apiPath, body, method, true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.spinner.stop('sync');
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 300000000,
            showProgressBar: false,
          });
          setTimeout(() => {
            this.spinner.stop('sync');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          this.spinner.stop('sync');
        }
      });
  }
  validate() {
    if (!this.biometric.valid) {
      return;
    }
    const body = {
      companyMasterID: this.biometric.value.company,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start('validate');
    this.api
      .callBiometricApi(this.constant.BIOMETRICVALIDATOR, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.spinner.stop('validate');
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('validate');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          this.spinner.stop('validate');
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onSelectFile() {
    if (!this.importattendance.valid) {
      return;
    }
    const formData = new FormData();

    this.company1 = this.importattendance.value.company;
    this.month = this.importattendance.value.YearMM;
    this.file1 = this.file;

    formData.append('file', this.file1);
    formData.append('id', this.company1);
    formData.append('month', this.month);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    this.spinner.start();
    this.disable = true;
    this.api
      .callApi(this.constant.UPLOADBIOMETRICEXCEL, formData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          // window.location.reload()

          this.closeModal.nativeElement.click();
          this.disable = false;
          this.file1 = '';
          this.company1 = '';
          this.month = '';
          this.spinner.stop();
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          // window.location.reload()
          this.closeModal.nativeElement.click();
          this.disable = false;
          this.file1 = '';
          this.company1 = '';
          this.month = '';
          this.spinner.stop();
        }
      });
  }

  onSelectFiles(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  demo() {
    window.open('/assets/DemoAttendanceExcel.xlsx', '_blank');
  }
}
