import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-list-fnf',
    templateUrl: './list-fnf.component.html',
    styleUrls: ['./list-fnf.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListFnfComponent implements OnInit {
  hideFilters: CommonFilterFields[] = [
    CommonFilterFields.Status,
    CommonFilterFields.Department,
    CommonFilterFields.Designation,
    CommonFilterFields.Division,
    CommonFilterFields.Project,
    CommonFilterFields.SalaryType,
    CommonFilterFields.SkillCategory,
    CommonFilterFields.WorkingArea,
    CommonFilterFields.User,
    CommonFilterFields.EmployementType,
  ];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
    CommonFilterButtonFields.Cancel,
  ];

  selectedMonth: string = '';
  filterData = {
    companyId: '',
    branchId: '',
    month: '',
  };

  maxMonth: string = '';

  callInit: boolean = true;

  adminRoot = environment.adminRoot;
  rows: any = [];
  companyId: any;
  permissionview: any = [];

  limit: 10;

  page = {
    totalCount: 0,
    offset: 0,
  };
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.checkpermission();
    this.selectedMonth = new Date().toISOString().slice(0, 7);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Ensures 2-digit month format
    this.maxMonth = `${currentYear}-${currentMonth}`;
  }

  getCompany(val?: any) {
    this.companyId = val;
    this.filterData.companyId = val;
    this.filterData.month = this.selectedMonth.replace('-', '');
    if (this.callInit) this.onSubmit();
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

          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'FullandFinalSettlement' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  onSubmit(val?: any) {
    this.callInit = false;

    if (val) {
      this.filterData.companyId = val.company;
      this.filterData.branchId = val.branch;
      this.filterData.month = val.month.replace('-', '');
    }

    this.spinner.start('submit');

    this.api
      .callApi(this.constant.LISTFNFEMPLOYEES, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
          }
          this.spinner.stop('submit');
        },
        (err) => {
          this.spinner.stop('submit');
        },
      );
  }

  navigateToFNFProcess(data: any): void {
    const body = {
      companyId: this.filterData.companyId,
      userId: data.userMasterID,
      month: this.filterData.month,
    };
    this.formValueStorageService.navigate(
      'listFNFComponent',
      body,
      '/payrolls/fnf/view',
      data.userMasterID,
    );
  }
}
