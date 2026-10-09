import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { event } from 'jquery';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-bonus-policy',
    templateUrl: './edit-bonus-policy.component.html',
    styleUrls: ['./edit-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditBonusPolicyComponent implements OnInit {

  @ViewChild('addbonuspolicy') addbonuspolicy: NgForm;

  allcomp: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  bonuspolicydata: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getcompany();
    this.editdata();

  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;

          this.spinner.stop('company');
        }
      });
  }


  editdata() {

    console.log(this.formValue.ListBonuspolicyComponent,'bnbnbnb');
    
    const id = this.formValue.ListBonuspolicyComponent.id;
    this.spinner.start('getData');
    this.api
      .callApi(this.constant.GETBONUSPOLICYBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.bonuspolicydata = res.data;
          this.spinner.stop('getData');
        },
        (err) => {
          this.spinner.stop('getData');
          console.log('error', err);
        },
      );
  }

  onSubmit() {
    if (!this.addbonuspolicy.valid) {
      return;
    }

    const body = {
      bonusPolicyName: this.bonuspolicydata.bonusPolicyName,
      bonusCycle: this.bonuspolicydata.bonusCycle,
      bonusCreditType: this.bonuspolicydata.bonusCreditType,
      bonusCreditCycle: this.bonuspolicydata.bonusCreditType == 'current' ? this.bonuspolicydata.bonusCreditCycle : null,
      payInSalary: this.bonuspolicydata.payInSalary ? true : false,
      companyMasterID: this.bonuspolicydata.companyMasterID,
    };

    this.spinner.start('add');
    this.api
      .callApi(this.constant.UPDATEBONUSPOLICY + this.formValue.ListBonuspolicyComponent.id, body, 'PUT', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/bonus_policy']);

              this.spinner.stop('add');
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('add');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        },
      );
  }

}
