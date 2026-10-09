import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';


@Component({
    selector: 'app-list-minimum-wages-master',
    templateUrl: './list-minimum-wages-master.component.html',
    styleUrls: ['./list-minimum-wages-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListMinimumWagesMasterComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  company: any;
  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.EmployementType,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.User,
    CommonFilterFields.WorkingArea,
    CommonFilterFields.Branch,
  ];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  commonFilterData: any

  filterData = {
    page: 1,
    limit: 10,
    companyMasterId: +localStorage.getItem('company_id'),
    stateMasterId: '',
    Export: false
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  currentPage: number;
  formValue: any;
  states: any = [];
  selectedState: any
  getDataFlag: boolean = true;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/payrolls/minimumWagesMaster',
          this.adminRoot + '/payrolls/minimumWagesMaster/edit_minimumWagesMaster',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListMinimumWagesMasterComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
    this.selectcountry(103);

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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MinimumWagesMaster' &&
              permissionval.operationName.includes('View')
            );
          });
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

  Export() {
    this.filterData.Export = true;
    this.spinner.start('a');

    this.api
      .callApi(this.constant.LISTMINIMUMWAGESMASTER, this.filterData, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.commonNotificationService.handleError('No data found to export!');
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'MinimumWagesMaster.xlsx');

            this.spinner.stop('a');
          }
          this.filterData.Export = false;
        },
        (err) => {
          this.filterData.Export = false;
          this.commonNotificationService.handleError(err.error.message || 'Someting Went Wrong!');
          this.spinner.stop('a');
        },
      );
  }

  getalldata() {
    this.getDataFlag = false;
    this.spinner.start('emp');
    this.api
      .callApi(
        this.constant.LISTMINIMUMWAGESMASTER,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            });
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          this.currentPage = this.filterData.page;
          this.spinner.stop('emp');
        }
      }, (err) => {
        this.spinner.stop('emp');
      });
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.page = Math.min(this.filterData.page, Math.ceil(this.page.totalCount / this.limit));
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getalldata();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  onSubmit(val: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterId = val?.company;
    this.filterData.stateMasterId = this.selectedState;

    this.getalldata();
  }

  clear() {
    this.formValue = this.formValueStorageService.getData();
    this.commonFilterData = null
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.rows = []
    this.getDataFlag = true;
    this.filterData = {
      companyMasterId: null,
      stateMasterId: '',
      Export: false,
      page: this.formValue.ListMinimumWagesMasterComponent?.body?.page ? this.formValue.ListMinimumWagesMasterComponent?.body?.page : 1,
      limit: this.formValue.ListMinimumWagesMasterComponent?.body?.limit ? this.formValue.ListMinimumWagesMasterComponent?.body?.limit : 10,
    };
    this.formValueStorageService.removeData('ListMinimumWagesMasterComponent', false);
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/minimumWagesMaster/add_minimumWagesMaster']);
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getalldata();
    } else {
      this.commonNotificationService.handleError('Something Went Wrong!');
    }
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListMinimumWagesMasterComponent',
      this.filterData,
      '/payrolls/minimumWagesMaster/edit_minimumWagesMaster',
      rowData.id,
    );
  }

  initGetCompany(companyMasterID: any) {
    this.filterData.companyMasterId = companyMasterID;
    if (this.getDataFlag) this.getalldata();
  }


}
