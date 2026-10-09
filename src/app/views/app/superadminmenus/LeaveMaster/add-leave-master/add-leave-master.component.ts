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
    selector: 'app-add-leave-master',
    templateUrl: './add-leave-master.component.html',
    styleUrls: ['./add-leave-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddLeaveMasterComponent implements OnInit {
  @ViewChild('addLeaveMaster') addLeaveMaster: NgForm;

  file: any;
  format: any;
  url: any;
  ipAddress: any;
  usertype: any;
  company_id: any;
  isdisebled: boolean = false;
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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
  }

  createCFData(event){
    console.log(event,'event');
    
  }

  onSubmit() {
    if (!this.addLeaveMaster.valid) {
      return;
    }

    let body = {
      LeaveName: this.addLeaveMaster.value.leaveName,
      LeaveDesc: this.addLeaveMaster.value.leaveDesc,
      createCF:this.addLeaveMaster.value.createCF,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.isdisebled = true;
    this.spinner.start();
    this.api.callApi(this.constant.CREATELEAVEMASTER, body, 'POST', true, true, true).subscribe(
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
