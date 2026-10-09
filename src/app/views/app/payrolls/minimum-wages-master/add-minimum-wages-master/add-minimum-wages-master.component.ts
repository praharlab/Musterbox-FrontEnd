import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-add-minimum-wages-master',
    templateUrl: './add-minimum-wages-master.component.html',
    styleUrls: ['./add-minimum-wages-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMinimumWagesMasterComponent implements OnInit {

  @ViewChild('addminWagesMaster') addminWagesMaster: NgForm;

  company: any;
  company_id: any;
  permissioncreate: any = [];
  adminRoot = environment.adminRoot;
  states: any = [];
  selectedState: any;
  selectedYearMonth: any;
  rows: any = [];
  previousMonth: string;
  futureMonth: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,

  ) { }

  ngOnInit(): void {
    this.getcompany();
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.selectcountry(103);

    const date = new Date();

     this.previousMonth = date.getFullYear() + '-' + String(date.getMonth()).padStart(2, '0');
    this.futureMonth = `${date.getFullYear()}-${(date.getMonth() + 2)
      .toString()
      .padStart(2, '0')}`;
      
  }

  getalldata(event: any) {
    this.selectedYearMonth = null;
    this.rows = [];

    if (!event) return;

    const filterData = {
      companyMasterId: this.company_id,
      stateMasterId: event,
    }

    this.spinner.start('emp');
    this.api
      .callApi(
        this.constant.LISTMINIMUMWAGESMASTER,
        filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop('emp');
        }
      }, (err) => {
        this.spinner.stop('emp');
      });
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
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MinimumWagesMaster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
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
          this.company = res.data;

          this.spinner.stop('company');
        }
      });
  }


  onSubmit() {
    if (!this.addminWagesMaster.valid) {
      return;
    }

    const body = {
      companyMasterId: this.company_id,
      stateMasterId: this.selectedState,
      applicableYYYYMM: this.selectedYearMonth.replace('-', ''),
      skilled: this.addminWagesMaster.value.skilled,
      semiSkilled: this.addminWagesMaster.value.semiskilled,
      unSkilled: this.addminWagesMaster.value.unskilled,
    };

    this.spinner.start('add');

    this.api.callApi(this.constant.ADDMINIMUMWAGESMASTER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/minimumWagesMaster']);
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.commonNotificationService.handleWarning(res.message);
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('add');
      },
    );
  }


}
