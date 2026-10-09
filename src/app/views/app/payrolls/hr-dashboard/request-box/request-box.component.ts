import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-request-box',
    templateUrl: './request-box.component.html',
    styleUrls: ['./request-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RequestBoxComponent implements OnInit {
  rows: any = {};
  showloader: any = 'true';
  adminRoot = environment.adminRoot;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit() {
    this.getdata(localStorage.getItem('company_id'));
  }

  getdata(id) {
    this.showloader = 'true';
    let date = new Date().toISOString().slice(0, 10);
    this.api
      .callApi(
        this.constant.REQUESTCOUNTHRDASHBOARD +
          `?companyMasterID=${id}&startdate=${date}&enddate=${date}`,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.showloader = 'false';
          if (res.status == 200) {
            this.rows = res.data;
          } else {
          }
        },
        (err) => {
          console.log('error', err);
        },
      );
  }

  navigateToCompanyAdvancedataPage(status: any): void {
    this.formValueStorageService.navigate(
      'CompanyAdvancePaymentComponent',
      {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
        advancestatus: '',
        exportData: false,
        exportFileType: '',
        startdate: '',
        searchQuery: '',
        enddate: '',
      },
      '/finances/company_advancedata',
      status,
    );
  }

  navigateToCompanyLoandataPage(status: any): void {
    this.formValueStorageService.navigate(
      'CompnayLoanDataComponent',
      {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
        loanstatus: '',
        exportData: false,
        exportFileType: '',
        startdate: '',
        searchQuery: '',
        enddate: '',
      },
      '/finances/company_loandata',
      status,
    );
  }

  navigateToCompanyExpensedataPage(status: any): void {
    this.formValueStorageService.navigate(
      'CompanyExpenseDataComponent',
      {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
        authorizationStatus: '',
        startdate: '',
        enddate: '',
        searchQuery: '',
        fromAmount: '',
        toAmount: '',
        product: '',
        expenseType: '',
        exportFileType: '',
        exportData: false,
      },
      '/finances/company_expensedata',
      status,
    );
  }

  navigateToLeavedataPage(status: any): void {
    this.formValueStorageService.navigate(
      'CompanyLeaveDataComponent',
      {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
        leavestatus: '',
        startdate: '',
        enddate: '',
        searchQuery: '',
        exportData: false,
        exportFileType: '',
      },
      '/attendances/leavedata_show',
      status,
    );
  }

  navigateToOvertimedataPage(status: any): void {
    this.formValueStorageService.navigate(
      'CompanyOvertimeDataComponent',
      {
        page: 1,
        limit: 10,
        CompanyMasterID: localStorage.getItem('company_id'),
        startdate: '',
        enddate: '',
        searchQuery: '',
        AuthorizationRequired: '',
        exportFileType: '',
        exportData: false,
      },
      '/overtimes/company_overtimedata',
      status,
    );
  }
}
