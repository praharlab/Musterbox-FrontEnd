import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-edit-employee-tax-regime',
    templateUrl: './edit-employee-tax-regime.component.html',
    styleUrls: ['./edit-employee-tax-regime.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeTaxRegimeComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  scrollBarHorizontal: boolean;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;
  limit: 10;

  permissionedit: any = []
  alluser: any = [];
  selected: any[];
  allbranch: any;
  company_id: any;
  company1: any;
  filterData = {
    regime: '',
    updateByIp: '',
    updateBy: '',
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
  regimedata: any;
  formValue: any;



  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    // this.getcompany();
    this.getDataById();
    this.getIPAddress();
  }

  getDataById() {
    this.spinner.start('id')
    this.api
      .callApi(this.constant.GETEMPLOYEETAXREGIMEBYID + this.formValue.ListEmployeeTaxRegimeComponent.id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.regimedata = res.data
        }
        this.spinner.stop('id');
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
        this.spinner.stop('id');
      },);
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

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeIncomeTaxRegime' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.spinner.stop();
        }
      });
  }

  // getcompany() {
  //   const body = {
  //     id: this.company_id,
  //   };

  //   this.spinner.start();
  //   this.api
  //     .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.company1 = res.data;

  //         this.spinner.stop();
  //       }
  //     });
  // }


  onSubmit1() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.regime = this.datefilter.value.regime;
    this.filterData.updateBy = localStorage.getItem('id');
    this.filterData.updateByIp = this.ipAddress

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.UPDATEEMPLOYEETAXREGIME + this.formValue.ListEmployeeTaxRegimeComponent.id, this.filterData, 'PUT', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/incometax/list_employee_tax_regime']);
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
