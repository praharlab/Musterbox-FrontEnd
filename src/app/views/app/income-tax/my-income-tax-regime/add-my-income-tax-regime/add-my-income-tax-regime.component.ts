import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-add-my-income-tax-regime',
    templateUrl: './add-my-income-tax-regime.component.html',
    styleUrls: ['./add-my-income-tax-regime.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMyIncomeTaxRegimeComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  scrollBarHorizontal: boolean;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;
  limit: 10;
  permissionview: any = [];
  permissioncreate: any = [1]
  alluser: any = [];
  selected: any[];
  allbranch: any;
  company_id: any;
  company1: any;
  filterData = {
    userMasterID: [],
    financialYear: '',
    regime: '',
    createByIp: '',
    createBy: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  rows: any = [];
  export: any;
  financialYears: any = [];
  ipAddress: any;
  selectedCompany: any;
  selectedBranch: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.company_id = +localStorage.getItem('company_id');
    this.getFinancialYears();
    this.checkpermission();

    this.getIPAddress();
  }


  getFinancialYears() {

    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.financialYears = res.data
        }
        this.spinner.stop('financialyear');
      },
      (err) => {

        this.spinner.stop('financialyear');
      },
    );

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

          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyIncomeTaxRegime' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit1() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.userMasterID = [localStorage.getItem('id')];
    this.filterData.financialYear = this.datefilter.value.financialYear;
    this.filterData.regime = this.datefilter.value.regime;
    this.filterData.createBy = localStorage.getItem('id');
    this.filterData.createByIp = this.ipAddress

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.ADDEMPLOYEETAXREGIME, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/incometax/list_my_incometax_regime']);
          }, 3000);
          this.spinner.stop('submit');
        } else {
          this.notifications.create('Validation', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      }, (err) => {
        this.notifications.create(
          '',
          err.error.message || 'Someting Went Wrong!',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
        this.spinner.stop('submit');
      },);
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

}
