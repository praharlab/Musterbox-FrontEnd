import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-short-leave-policy',
    templateUrl: './edit-short-leave-policy.component.html',
    styleUrls: ['./edit-short-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditShortLeavePolicyComponent implements OnInit {
  @ViewChild('editShortLeave') editShortLeave: NgForm;
  ipAddress: any;
  message: any = 'Value must be Positive!';
  adminRoot = environment.adminRoot;
  formValue:any;
  company_id:any;
  company:any;
  shortLeaveData:any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.formValue = this.formValueStorageService.getData();
    this.getIPAddress();
    this.getcompany();
    this.editdata();
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

  editdata() {
    const id = this.formValue.EditShortLeavePolicyComponent.id;
    let string = `?id=${id}`;

    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETSHORTLEAVEDATA + string , {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.shortLeaveData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
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

  onSubmit() {
    if (!this.editShortLeave.valid) {
      return;
    } 

    let body = {
      id : this.formValue.EditShortLeavePolicyComponent.id,
      shortLeaveName : this.editShortLeave.value['shortLeavePolicyName'],
      maxMinutesForShortLeave : this.editShortLeave.value['maxMinutes'],
      companyMasterID:  this.editShortLeave.value['companyMasterID'],
      noOfShortLeave: this.editShortLeave.value['noOfShortLeave'],
    };
    
    this.spinner.start();
    this.api.callApi(this.constant.UPDATESHORTLEAVE, body, 'POST', true, true, true).subscribe(
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
