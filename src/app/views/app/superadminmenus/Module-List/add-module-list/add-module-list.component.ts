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
    selector: 'app-add-module-list',
    templateUrl: './add-module-list.component.html',
    styleUrls: ['./add-module-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddModuleListComponent implements OnInit {
  @ViewChild('addModule') addModule: NgForm;
  buttonDisabled = false;
  buttonState = '';
  ipAddress: any;
  moduleNameExistsError: boolean = false;
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
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  // onSubmit() {
  //   if (!this.addModule.valid) {
  //     return
  //   }
  //   let body
  //     body = {
  //       moduleName: this.addModule.value.moduleName,
  //       status: '1',
  //       createBy: localStorage.getItem('id'),
  //       createByIp: this.ipAddress,
  //     }
  //   this.spinner.start()
  //   this.buttonDisabled = true
  //   this.buttonState = 'show-spinner'
  //   this.api
  //     .callApi(
  //       this.constant.CREATEMODULE,
  //       body,
  //       'POST',
  //       true,
  //       true,
  //       true,
  //     )
  //     .subscribe(
  //       (res: any) => {
  //         if (res.status == 200) {
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
  //             this.router.navigate(['app/Module_list'])
  //             this.buttonDisabled = false
  //             this.buttonState = ''
  //             this.spinner.stop()
  //           }, 3000)
  //         } else {
  //           this.buttonDisabled = false
  //           this.notifications.create(
  //             'Error',
  //             res.message,
  //             NotificationType.Bare,
  //             {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: false,
  //             },
  //           )
  //           this.buttonDisabled = false
  //           this.buttonState = ''
  //           this.spinner.stop()
  //         }
  //       },
  //       (err) => {
  //         this.buttonDisabled = false
  //         this.notifications.create('Error', err, NotificationType.Bare, {
  //           theClass: 'outline primary',
  //           timeOut: 3000,
  //           showProgressBar: false,
  //         })
  //         this.buttonDisabled = false
  //         this.buttonState = ''
  //         this.spinner.stop()
  //       },
  //     )
  // }

  onSubmit() {
    if (!this.addModule.valid) {
      return;
    }
    let body;
    body = {
      moduleName: this.addModule.value.moduleName,
      status: '1',
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEMODULE, body, 'POST', true, true, true).subscribe(
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
          this.buttonDisabled = false;
          this.notifications.create(
            'Error',
            'Module with the same name already exists',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
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

  // Reset the moduleNameExistsError flag when the user interacts with the form.
  onModuleNameInputChange() {
    this.moduleNameExistsError = false;
  }
}
