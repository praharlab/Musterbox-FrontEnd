import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-bank-report',
    templateUrl: './bank-report.component.html',
    styleUrls: ['./bank-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BankReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('bankFilter') bankFilter: NgForm;

  company_id: any;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  company1: any;
  designation1: any;
  permissionview: any = [];
  allbranch: any = [];
  allbank: any = [];
  bankReportData: any = [];
  selectedValue: string;
  temp: any = [];

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    monthYear: '',
    exportData: false,
    selectedFields: [],
    paymentStatus: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  formatBody = {
    companyMasterID: null,
    bankMasterID: null
  }
  currentPage: number;
  bankdata: any
  bankStatementFormat: any = []
  isDisabled: boolean = false
  selectedFieldsList: string[] = [
    'Employee Code',
    'Employee Name',
    'Name As Per Bank',
    'Contact No',
    'Department',
    'Designation',
    'Bank Name',
    'IFSC code',
    'Account Number',
    'Gross Salary',
    'Net Salary',
  ];
  selectedFields: any[] = [];
  rows: any = [];
  resultColumns: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit() {
    this.selectedFields = this.selectedFieldsList;

    this.setVariables()
      .then(() => Promise.all([this.checkpermission(), this.getcompany(), this.getbank()]))
      .then(() => this.spinner.stop('loader'))
      .catch(() => {
        this.handleCatchError();
      });
    this.selectcompany(this.company_id)
  }

  private setVariables() {
    return new Promise((resolve, reject) => {
      try {
        this.bankReportData = [];
        this.spinner.start('loader');
        this.company_id = localStorage.getItem('company_id');
        this.page = {
          totalCount: 0,
          offset: 0,
        };
        this.limit = 10;
        this.filterData = {
          page: 1,
          limit: 10,
          companyMasterID: '',
          branchMasterID: '',
          monthYear: '',
          exportData: false,
          selectedFields: [],
          paymentStatus: ''

        };
        resolve('Variables set successfully');
      } catch (error) {
        this.spinner.stop('loader');
        reject(error);
      }
    });
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('loader');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          if (this.company1)
            this.company_id = +localStorage.getItem('company_id')
          this.spinner.stop('loader');
        }
      });
  }

  checkpermission() {
    this.spinner.start('loader');
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
              permissionval.formName == 'BankStatementReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('loader');
        }
      });
  }

  clear() {
    this.bankFilter.resetForm();
    this.isDisabled = false;
    this.ngOnInit();
  }

  selectcompany(id) {
    this.spinner.start('loader');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stop('loader');
      });
    this.formatBody.companyMasterID = id
    this.getAllData(this.formatBody)
    this.getBankData(id);
  }

  getbank() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start('loader');
    this.api
      .callApi(this.constant.GETBANKDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allbank = res.data;
          this.spinner.stop('loader');
        }
      });
  }

  onSubmit() {
    if (!this.bankFilter.valid) {
      return;
    }
    this.resultColumns = [];

    this.filterData.page = 1;
    this.filterData.companyMasterID = this.bankFilter.value.company;
    this.filterData.branchMasterID = this.bankFilter.value.branch;
    this.filterData.monthYear = this.bankFilter.value.monthYear.replace('-', '');
    this.filterData.selectedFields = this.selectedFields;
    this.filterData.paymentStatus = this.bankFilter.value.paymentStatus;

    if (this.filterData.paymentStatus != 'unpaid') {
      if (!this.filterData.selectedFields.includes('Paid Date')) {
        this.filterData.selectedFields.push('Paid Date');
      }
    } else {
      this.filterData.selectedFields = this.filterData.selectedFields.filter(
        (field) => field !== 'Paid Date'
      );
    }


    this.getBankReportData();
  }

  getBankReportData() {
    this.api
      .callApi(this.constant.BANKREPORT, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);

            for (let key in this.rows[0]) {
              this.resultColumns.push({
                name: key,
                prop: key,
                flexGrow: 1.2,
                minWidth: 200,
              });
            }

            this.spinner.stop('loader');
          } else {
            this.handleCatchError();
          }
        },
        () => {
          this.handleCatchError();
        },
      );
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getBankReportData();
    } else {
      this.handleCatchError();
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getBankReportData();
    } else {
      this.handleCatchError();
    }
  }

  onDownlad() {
    this.spinner.start('loader');
    this.filterData.page = null;
    this.filterData.limit = null;
    this.filterData.exportData = true;
    this.api
      .callApi(this.constant.BANKREPORT, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Bank-Report-${this.filterData.monthYear}.xlsx`);
          this.selectedValue = null;
          this.filterData.exportData = false;
          this.filterData.page = 1;
          this.filterData.limit = 10;
          this.spinner.stop('loader');
        },
        (err) => {
          this.handleCatchError();
        },
      );
  }

  handleCatchError() {
    this.spinner.stop('loader');
    this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }

  onChangeBank(item) {
    if (!item) {
      this.selectedFields = this.selectedFieldsList;
      this.isDisabled = false;
    }
    this.formatBody.bankMasterID = item
    this.getAllData(this.formatBody);
  }

  getBankData(companyMasterID: number) {
    this.spinner.start('bankData');
    let filter = { companyMasterID: companyMasterID };
    this.api.callApi(this.constant.GETBANKSTATEMENTFORMAT, filter, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankdata = res?.data?.map((x) => ({ bankMasterID: x?.bankMaster?.bankMasterID, bankName: x?.bankMaster?.bankName }));
        this.spinner.stop('bankData');
      },
      (err) => {
        this.spinner.stop('bankData');
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 2000,
          showProgressBar: false,
        });
      },
    );
  }

  getAllData(body: { companyMasterID: any, bankMasterID: any }) {
    if (!body.companyMasterID || !body.bankMasterID) {
      return;
    }
    this.api.callApi(this.constant.GETBANKSTATEMENTFORMAT, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        if (res.data[0]?.fields.length > 0) {
          this.isDisabled = true;
          this.selectedFields = res.data[0]?.fields;
        } else {
          this.isDisabled = false;
          this.selectedFields = this.selectedFieldsList;
        }
        this.page.totalCount = res.totalcount;
        setTimeout(() => {
          this.currentPage = this.filterData.page;
        }, 100);
        this.spinner.stop();
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 2000,
          showProgressBar: false,
        })
      },
    )
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }
}
