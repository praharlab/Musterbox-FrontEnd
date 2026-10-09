import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-advance-payment-new',
    templateUrl: './list-advance-payment-new.component.html',
    styleUrls: ['./list-advance-payment-new.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAdvancePaymentNewComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  adminRoot = environment.adminRoot;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [
    'EmployeeName',
    'CompanyName',
    'Description',
    'Amount',
    'AdvanceStatus',
    'CreatedAt',
  ];
  tabledata = [
    'EmployeeName',
    'CompanyName',
    'Description',
    'Amount',
    'AdvanceDate',
    'Deduct In Month',
    'PaymentMode',
    'ReferenceNO',
    'ReferenceDate',
    'Status',
    'AdvanceStatus',
    'RejectionRemark',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
  ];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    searchQuery: '',
    startdate: '',
    enddate: '',
  };
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  rows1: any = [];
  dialog: any;
  remarks: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: localStorage.getItem('id'),
      searchQuery: '',
      startdate: '',
      enddate: '',
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAdvancePaymentData();
    this.checkpermission();
  }

  getAdvancePaymentData() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETADVANCEBYUSERID, this.filterData, 'POST', true, false, true)
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
              permissionval.formName == 'EmployeeAdvance' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeAdvance' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/advancePaymentNew/reqadvancePayment']);
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAdvancePaymentData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAdvancePaymentData();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    if(this.datefilter.value.startdate > this.datefilter.value.enddate){
      return this.handleError("From Date can't be greater than To Date")
    }

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;
    this.getAdvancePaymentData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAdvancePaymentData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAdvancePaymentData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  getStatusLabel(AdvanceStatus: number): string {
    switch (AdvanceStatus) {
      case 0:
        return 'Pending';
      case 1:
        return 'Approved';
      case 2:
        return 'Rejected';
      default:
        return 'Pending';
    }
  }

  getStatusClass(AdvanceStatus: number): string {
    switch (AdvanceStatus) {
      case 0:
        return 'btn btn-warning';
      case 1:
        return 'btn btn-success';
      case 2:
        return 'btn btn-danger';
      default:
        return 'btn btn-warning';
    }
  }

  RejectionRemark(row) {
    this.remarks = row.RejectionRemark;
  }

  downloadFile() {
    let data1 = [];

    let filterData = {
      page: '',
      limit: '',
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      userMasterID: this.filterData.userMasterID,
      searchQuery: this.filterData.searchQuery,
    };

    this.api
      .callApi(this.constant.GETADVANCEBYUSERID, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let rows = res.data;
          for (var i = 0; i < rows.length; i++) {
            const data2 = {
              UserName: rows[i].userMaster.displayName,
              UserNumber: rows[i].userMaster.userNumber,
              CompanyName: rows[i].companyMaster.companyName,
              Amount: rows[i].amount,
              Date: new Date(rows[i].advanceDate).toISOString().split('T')[0],
              Status: rows[i].Status,
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
          saveAs(blob, 'advancePaymentNew.csv');
        }else{
          this.handleError(res.message);
        }
      },(err) => {
        this.handleError(err.error.message);
      });
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
