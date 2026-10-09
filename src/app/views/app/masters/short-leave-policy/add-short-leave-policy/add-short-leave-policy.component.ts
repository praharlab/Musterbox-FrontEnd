import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-add-short-leave-policy',
    templateUrl: './add-short-leave-policy.component.html',
    styleUrls: ['./add-short-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddShortLeavePolicyComponent implements OnInit {
  @ViewChild('addShortLeave') addShortLeave: NgForm;
  ipAddress: any;
  message: any = 'Value must be Positive!';
  adminRoot = environment.adminRoot;
  company: any = [];
  company_id: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getIPAddress();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }

  onSubmit() {    

    if (!this.addShortLeave.valid) {
      return;
    }

    let body = {
      shortLeaveName : this.addShortLeave.value['shortLeavePolicyName'],
      maxMinutesForShortLeave : this.addShortLeave.value['maxMinutes'],
      noOfShortLeave: this.addShortLeave.value['noOfShortLeave'],
      companyMasterID:  this.addShortLeave.value['companyMasterID'],
    };
    
    this.spinner.start();
    this.api.callApi(this.constant.CREATESHORTLEAVE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/short_leave_policy']);
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

  changeInputValue(formcontrol, name){
    const value = formcontrol.value;
    if(value < 0 && name === 'minutes'){
      formcontrol.setErrors({negativeMinutes : true});
    }else if(value < 0 && name === 'noOfLeave'){
      formcontrol.setErrors({negativNoOfLeave : true});
    }else if(value > 31 && name === 'noOfLeave'){
      formcontrol.setErrors({maxNoOfLeave : true});
    } else {
      const errors = { ...formcontrol.errors };
      if(name === 'minutes'){
        delete errors.negativeMinutes;
      }else{
        delete errors.negativNoOfLeave;
        delete errors.maxNoOfLeave;
      }
      formcontrol.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
