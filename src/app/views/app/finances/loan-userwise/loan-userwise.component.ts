import { Component, ViewChild, Input, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { DatePipe } from '@angular/common';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-loan-userwise',
    templateUrl: './loan-userwise.component.html',
    styleUrls: ['./loan-userwise.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LoanUserwiseComponent implements OnInit {
  rejectionRemark: string;
  adminRoot = environment.adminRoot;

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addrefund') addrefund: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 5;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['LoanRemark', 'UserName', 'LoanAmount', 'givenDate', 'paymentmode', 'loanstatus'];
  SelectionType = SelectionType;
  tabledata = [
    'LoanRemark',
    'UserName',
    'LoanAmount',
    'givenDate',
    'paymentmode',
    'loanstatus',
    'Status',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'updateByIp',
    'updatedAt',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    startdate: '',
    enddate: '',
    searchQuery: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  events: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  ipAddress: any;
  depositid: any;
  rows1: any = [];
  loandata: any;

  datearr: any[];
  LoanAdvance: any;
  paidInst: any;
  editable: boolean;
  AdvanceData: any;
  employee: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: localStorage.getItem('id'),
      startdate: '',
      enddate: '',
      searchQuery: '',
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getMyLoanData();
    this.checkpermission();
  }

  getMyLoanData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETUSERLOAN, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  editdata(row) {

    this.spinner.start();
    this.api
      .callApi(this.constant.GETLOANBYID + row, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.loandata = res.data;
        this.loandata.startMonth =
          JSON.stringify(this.loandata.startMonth).slice(0, 4) +
          '-' +
          JSON.stringify(this.loandata.startMonth).slice(4);
        this.loandata.userMasterID = parseInt(this.loandata.userMasterID);
        this.loandata.companyMasterID = parseInt(this.loandata.companyMasterID);
        this.loandata.givenDate = this.datepipe.transform(this.loandata.givenDate, 'yyyy-MM-dd');
        this.datearr = res.childData;
        this.LoanAdvance = res.LoanAdvance;
        this.datearr.forEach((element) => {
          element.EMIMonth = element.EMIMonth.slice(0, 4) + '-' + element.EMIMonth.slice(4);
          if (element.RefrenceId != null) {
            this.paidInst = this.paidInst + parseFloat(element.EMIAmount);
            this.editable = false;
          }
        });
        if (this.LoanAdvance.length != 0) {
          this.LoanAdvance.forEach((element) => {
            this.AdvanceData = this.AdvanceData + parseFloat(element.Amount);
          });
        }
      });
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeLoan' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeLoan' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getMyLoanData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getMyLoanData();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getMyLoanData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getMyLoanData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getMyLoanData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  downloadFile() {
    let data1 = [];

    let filterData = {
      page: '',
      limit: '',
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      userMasterID: this.filterData.userMasterID,
    };

    this.api
      .callApi(this.constant.GETUSERLOAN, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
        }
      });

    for (var i = 0; i < this.rows.length; i++) {
      const data2 = {
        LoanID: this.rows[i].LoanID,
        LoanRemark: this.rows[i].LoanRemark,
        UserName: this.rows[i].userMaster.displayName,
        LoanAmount: this.rows[i].LoanAmount,
        LoanDate: new Date(this.rows[i].givenDate).toISOString().split('T')[0],
        paymentmode: this.rows[i].paymentmode,
        CreateBy: this.rows[i].createBy,
        CreateByIp: this.rows[i].createByIp,
        CreateAt: new Date(this.rows[i].createdAt).toISOString().split('T')[0],
      };
      data1.push(data2);
    }

    const replacer = (key, value) => (value === null ? '' : value);
    const header = Object.keys(data1[0]);
    let csv = data1.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'Loan.csv');
  }

  showRemark(row: any) {
    if (row && row.LoanRemark) {
      this.rejectionRemark = row.LoanRemark;
    }
  }

  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/loanUserwise/add_loanUserwise']);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
