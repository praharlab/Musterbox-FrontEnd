import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-upload-attendance',
    templateUrl: './upload-attendance.component.html',
    styleUrls: ['./upload-attendance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UploadAttendanceComponent implements OnInit {
  @ViewChild('upload') upload: NgForm;
  @ViewChild('importattendance') importattendance: NgForm;
  company_id: any;
  usertype: string;
  childcompany: string;
  allcomp: any;
  permissionsync: any = [];
  ipAddress: any;
  url: string | ArrayBuffer;
  file: any;
  format: string;

  constructor(
    private notifications: AppNotificationService,
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getcompany();
    this.company_id =  +localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
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
              permissionval.formName == 'ExcelAttendance' &&
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
  // sync()
  // {
  //   if (!this.upload.valid) {
  //     return
  //   }
  //   this.spinner.start()
  //   if(this.upload.value.company == 27){
  //     const body = {
  //       company:27
  //     }
  //     this.spinner.start()
  //     this.api
  //       .callApi(
  //         this.constant.SYNCATTENDANCE1,
  //         body,
  //         'POST',
  //         true,
  //         false,
  //         true,
  //       )
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.spinner.stop()
  //           this.notifications.create(
  //             'Done',
  //             res.message,
  //             NotificationType.Bare,
  //             {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: true,
  //             },
  //           )
  //           setTimeout(() => {
  //             this.spinner.stop()
  //           }, 3000)
  //         }
  //       })
  //   }
  //   else
  //   {
  //   this.api
  //     .callApi(
  //       this.constant.SYNCATTENDANCE + this.upload.value.company,
  //       {},
  //       'GET',
  //       true,
  //       false,
  //       true,
  //     )
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.spinner.stop()
  //         this.notifications.create(
  //           'Done',
  //           res.message,
  //           NotificationType.Bare,
  //           {
  //             theClass: 'outline primary',
  //             timeOut: 3000,
  //             showProgressBar: true,
  //           },
  //         )
  //         setTimeout(() => {
  //           this.spinner.stop()
  //         }, 3000)

  //       }
  //       else {
  //         this.notifications.create(
  //           'Error',
  //           res.message,
  //           NotificationType.Bare,
  //           {
  //             theClass: 'outline primary',
  //             timeOut: 3000,
  //             showProgressBar: false,
  //           },
  //         )

  //         this.spinner.stop()
  //       }
  //     })
  //   }
  // }
  onSelectFile() {
    if (!this.importattendance.valid) {
      return;
    }
    const formData = new FormData();

    formData.append('file', this.file);
    formData.append('companyMasterID', this.upload.value.company);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    this.spinner.start();
    this.api
      .callApi(this.constant.UPLOADEXCELATTENDANCE, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              window.location.reload();
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
          this.notifications.create('Error', err, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  validate() {
    if (!this.upload.valid) {
      return;
    }
    this.spinner.start();
    this.api
      .callApi(
        this.constant.VALIDATEATTENDANCE + this.upload.value.company,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.spinner.stop();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
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
      });
  }
}
