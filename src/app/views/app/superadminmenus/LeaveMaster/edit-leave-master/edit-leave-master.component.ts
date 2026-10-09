import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    selector: 'app-edit-leave-master',
    templateUrl: './edit-leave-master.component.html',
    styleUrls: ['./edit-leave-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditLeaveMasterComponent implements OnInit {
  @ViewChild('addLeaveMaster') addLeaveMaster: NgForm;
  ipAddress: any;
  usertype: any;
  company_id: any;
  leaveData: any;
  isdisebled: boolean = false;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    public activatedRoute: ActivatedRoute,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.editdata();
  }

  editdata() {
    let leaveid = this.formValue.ListLeaveMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETLEAVEMASTERBYID + '/' + leaveid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.leaveData = res.data;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
  }

  onSubmit() {
    if (!this.addLeaveMaster.valid) {
      return;
    }

    let body = {
      LeaveID: this.formValue.ListLeaveMasterComponent.id,
      LeaveName: this.addLeaveMaster.value.leaveName,
      LeaveDesc: this.addLeaveMaster.value.leaveDesc,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.isdisebled = true;
    this.spinner.start();
    this.api.callApi(this.constant.UPDATELEAVEMASTER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/leaveMaster']);

            this.spinner.stop();
            this.isdisebled = false;
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
