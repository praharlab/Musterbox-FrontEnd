import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-appversion',
    templateUrl: './appversion.component.html',
    styleUrls: ['./appversion.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppversionComponent implements OnInit {
  @ViewChild('editversion') editversion: NgForm;
  mediumDateFormat = environment.mediumDateFormat;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  ipAddress: any;
  rows: any = [];
  editbyid: any;
  usertype: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {
    window.onresize = () => {};
  }
  ngOnInit(): void {
    this.alldata();
    this.getIPAddress();
    this.usertype = localStorage.getItem('usertype');
  }
  alldata() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETAPPVERSION, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop();
        }
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  edit(item) {
    this.editbyid = item;
  }
  onSubmit1() {
    if (!this.editversion.valid) {
      return;
    }
    let body = {
      appVersionID: this.editbyid.appVersionID,
      appVersion: this.editversion.value.appVersion,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEAPPVERSION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/superadminmenus/appversion']).then(() => {
              window.location.reload();
              this.spinner.stop();
            });
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }
}
