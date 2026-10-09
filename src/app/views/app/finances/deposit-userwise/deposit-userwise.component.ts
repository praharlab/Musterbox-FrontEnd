import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-deposit-userwise',
    templateUrl: './deposit-userwise.component.html',
    styleUrls: ['./deposit-userwise.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DepositUserwiseComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addrefund') addrefund: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [
    'DepositID',
    'DepositCategoryName',
    'UserName',
    'Amount',
    'DateOfDeposit',
    'DepositReceiveAS',
  ];
  SelectionType = SelectionType;
  tabledata = [
    'DepositID',
    'DepositCategoryName',
    'UserName',
    'Amount',
    'DateOfDeposit',
    'DepositReceiveAS',
    'Description',
    'Status',
    'CreateBy',
    'CreatedAt',
    'updateBy',
    'UpdatedAt',
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
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  // filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  usertype: any;
  company_id: any;
  ipAddress: any;
  depositid: any;
  rows1: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
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

    this.getdepositcategory();
    this.checkpermission();
  }

  getdepositcategory() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.CREATEUSERDEPOSIT, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main');
          } else {
            this.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main');
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeDeposit' &&
              permissionval.operationName.includes('View')
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
        this.getdepositcategory();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getdepositcategory();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getdepositcategory();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getdepositcategory();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getdepositcategory();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  downloadFile() {
    let data1 = [];
    this.spinner.start();
    let filterData = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      searchQuery: this.filterData.searchQuery,
    };

    this.api
      .callApi(this.constant.CREATEUSERDEPOSIT, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let rows = res.data;

            for (var i = 0; i < rows.length; i++) {
              const data2 = {
                depositcategory: rows[i].depositcategory.depositcategoryname,
                UserName: rows[i].userMaster.displayName,
                Amount: rows[i].amount,
                Date: new Date(rows[i].dateOfDeposit).toISOString().split('T')[0],
                DepositReceiveAs: rows[i].depositReceiveAs,
                CreateBy: rows[i].createBy,
                CreateAt: new Date(rows[i].createdAt).toISOString().split('T')[0],
              };
              data1.push(data2);
            }

            const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
            const header = Object.keys(data1[0]);
            let csv = data1.map((row) =>
              header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
            );
            csv.unshift(header.join(','));
            let csvArray = csv.join('\r\n');

            var blob = new Blob([csvArray], { type: 'text/csv' });
            saveAs(blob, 'Deposit.csv');

            this.spinner.stop();
          } else {
            this.spinner.stop();
            this.handleError(res.message);
          }
        },
        (err) => {
          this.spinner.stop();
          this.handleError(err.error.message);
        },
      );
  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
    this.rows = [];
  }
  changeshowfields() {
    this.ngOnInit();
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
