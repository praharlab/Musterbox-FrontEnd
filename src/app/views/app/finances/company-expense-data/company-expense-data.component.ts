import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import {
  expenseTypeArrayForDropDown,
} from 'src/app/constants/commonVariables';
@Component({
    selector: 'app-company-expense-data',
    templateUrl: './company-expense-data.component.html',
    styleUrls: ['./company-expense-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CompanyExpenseDataComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  row: any;
  rows = [];
  itemOptionsPerPage = ItemOptionsPerPageArray;
  showFinanceData: boolean = false;
  filterData = {
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
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  limit = 10;
  expenseTypeArrayForDropDownData: any = expenseTypeArrayForDropDown;

  permissionview: any = [];

  company_id: string;
  enddate: Date;
  mainproduct: any[];
  product: any;
  selectedValue: string;

  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    
    this.filterData = {
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
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.filterData.authorizationStatus = this.formValue.CompanyExpenseDataComponent.id;
    this.company_id = localStorage.getItem('company_id');
    this.getExpenseRequestData();
    this.checkpermission();
    this.getProduct();
  }

  getProduct() {
    this.spinner.start("loader");
    this.api
      .callApi(
        this.constant.GETALLPRODUCTBYPARENTCHILD + localStorage.getItem('company_id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.product = res.data;
          this.mainproduct = [];
          for (var i = 0; i < this.product.length; i++) {
            this.product[i].productdetails =
              this.product[i].productName +
              ' ( ' +
              this.product[i].companyMaster.companyName +
              ' )';
            this.mainproduct.push(this.product[i].productID);
          }
        } else {
          this.handleCatchError();
        }
      }, (err) => {
        this.handleCatchError();
      });
  }

  selectfrom() {
    this.enddate = new Date();
  }

  getExpenseRequestData() {
    this.spinner.start("loader");

    this.api
      .callApi(this.constant.EXPENSEDATASHOW, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data.rows;
          this.page.totalCount = res.data.count;
          this.spinner.stop("loader");
        } else {
          this.handleCatchError();
        }
      }, (err) => {
        this.handleCatchError();
      });
  }

  checkpermission() {
    this.spinner.start("loader");
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
              permissionval.formName == 'HrDashboard' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop("loader");
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.ngOnInit();
      this.filterData.searchQuery = '';
    }

    if (inputValue.length >= 3) {
      this.filterData.searchQuery = inputValue;
      this.filterData.companyMasterID = localStorage.getItem('company_id');
      this.getExpenseRequestData();
    }
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getExpenseRequestData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getExpenseRequestData();
    } else {
      console.log('error');
    }
  }

  onSubmit() {
    if (!this.datefilter.value.expensetype || !this.datefilter.value.fromdate || !this.datefilter.value.todate || !this.datefilter.value.fromamount || !this.datefilter.value.toamount || !this.datefilter.value.productname) {
      return;
    }

    if (
      (this.datefilter.value.fromdate && !this.datefilter.value.todate) ||
      (!this.datefilter.value.fromdate && this.datefilter.value.todate)
    ) {
      this.notifications.create('Error', 'from & to dates are required!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    if (
      (this.datefilter.value.fromamount && !this.datefilter.value.toamount) ||
      (!this.datefilter.value.fromamount && this.datefilter.value.toamount)
    ) {
      this.notifications.create('Error', 'from & to amount are required!', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    this.filterData.startdate = this.datefilter.value.fromdate;
    this.filterData.enddate = this.datefilter.value.todate;
    this.filterData.fromAmount = this.datefilter.value.fromamount;
    this.filterData.toAmount = this.datefilter.value.toamount;
    this.filterData.expenseType = this.datefilter.value.expensetype;
    this.filterData.product = this.datefilter.value.productname;
    this.getExpenseRequestData();
  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

  onOptionSelectDownlad() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start("loader");
    this.filterData.page = null;
    this.filterData.limit = null;
    this.filterData.exportFileType = this.selectedValue;
    this.filterData.exportData = true;
    this.api
      .callApi(this.constant.EXPENSEDATASHOW, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'Company-Expense-Report.csv');
            this.selectedValue = null;
            this.filterData.exportData = false;
            this.filterData.exportFileType = '';
            this.filterData.page = 1;
            this.filterData.limit = 10;
            this.spinner.stop("loader");
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'Company-Expense-Report.xlsx');
            this.selectedValue = null;
            this.filterData.exportData = false;
            this.filterData.exportFileType = '';
            this.filterData.page = 1;
            this.filterData.limit = 10;
            this.spinner.stop("loader");
          }
        },
        (err) => {
          this.handleCatchError();
        },
      );
  }

  handleCatchError() {
    this.spinner.stop("loader");
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }

  onModalClose(){
    this.showFinanceData = false;
    this.row = null;
  }

  showExpenseData(row: any){
    this.showFinanceData = true;
    this.row = row;
  }
}
