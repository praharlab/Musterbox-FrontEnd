import {
  Component,
  ViewChild,
  OnInit,
  ViewContainerRef,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
@Component({
    selector: 'app-list-user-data',
    templateUrl: './list-user-data.component.html',
    styleUrls: ['./list-user-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListUserDataComponent implements OnInit {
  @Input('userMasterID') userMasterID: any;
  authorizationPermissionView: any = [];
  formValue: any;
  usertype: any;
  userId: any = null;
  userData: any;
  ipAddress: any;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
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
    this.usertype = localStorage.getItem('usertype');
    this.userId = this.formValue.ListEmployeeMasterComponent?.id ? this.formValue.ListEmployeeMasterComponent?.id : this.formValue.ListManageLeaveBalanceComponent?.id;
    this.getUsers();
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

          this.authorizationPermissionView = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Authorization' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }
  getUsers() { 
    const users_Body = {
      userMasterID: this.userMasterID,
      status: [0, 1]
    };
    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userData = res.data;
        }
        this.spinner.stop('users');
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
