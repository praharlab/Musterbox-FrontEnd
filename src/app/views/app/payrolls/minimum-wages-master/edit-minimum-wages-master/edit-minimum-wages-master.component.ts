import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-minimum-wages-master',
    templateUrl: './edit-minimum-wages-master.component.html',
    styleUrls: ['./edit-minimum-wages-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditMinimumWagesMasterComponent implements OnInit {

  @ViewChild('editminWagesMaster') editminWagesMaster: NgForm;

  company: any;
  company_id: any;

  adminRoot = environment.adminRoot;
  states: any = [];
  selectedState: any;
  selectedYearMonth: any;
  minWagesData: any
  permissionedit: any = [];
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.selectcountry(103);
    this.getData();
  }

  getData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETMINIMUMWAGESMASTERBYID + this.formValue.ListMinimumWagesMasterComponent.id, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.minWagesData = res.data;
          this.selectedYearMonth = this.minWagesData ? String(this.minWagesData.applicableYYYYMM).slice(0, 4) + '-' + String(this.minWagesData.applicableYYYYMM).slice(4, 6) : '';
          this.spinner.stop('data');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }


  selectcountry(country: any) {
    if (!country) {
      return;
    }
    this.spinner.start('state');
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.states = res.data;
          this.spinner.stop('state');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('state');
        },
      );
  }

  checkpermission() {
    this.spinner.start('permission');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MinimumWagesMaster' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }


  onSubmit() {
    if (!this.editminWagesMaster.valid) {
      return;
    }

    const body = {
      skilled: this.minWagesData.skilled,
      semiSkilled: this.minWagesData.semiSkilled,
      unSkilled: this.minWagesData.unSkilled,
    };

    this.spinner.start('update');

    this.api.callApi(this.constant.UPDATEMINIMUMWAGESMASTER + this.formValue.ListMinimumWagesMasterComponent.id, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/minimumWagesMaster']);
            this.spinner.stop('update');
          }, 3000);
        } else {
          this.commonNotificationService.handleWarning(res.message);
          this.spinner.stop('update');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('update');
      },
    );
  }

}
