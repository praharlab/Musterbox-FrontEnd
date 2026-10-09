import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-visit-report-customer',
    templateUrl: './visit-report-customer.component.html',
    styleUrls: ['./visit-report-customer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VisitReportCustomerComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    startDate: '',
    endDate: '',
    customerID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  childcompany: string;
  cid: string;
  selected1: any = [];
  companydata: any;
  selected2: any = [];
  selecte3: any = [];
  allbranch: any;
  alluser: any;
  customer = [];
  branchfilter: boolean = false;
  employeedata: any;
  enddate: Date;
  rows1 = [];
  visitcustomizefield: any;
  visitreportcustomizefield: any;
  currentPage: number;

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
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        }
      });
  }

  selectcompany(id) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('customerlist');
    this.api
      .callApi(this.constant.getAllCUSTOMERDataByCompanyId, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.customer = res.data;

          this.selectAllForDropdownItems(this.customer);
          let data1 = [];
          this.customer.forEach(async (rating) => {
            data1.push(rating.customerID);
          });
        }
      });
    this.spinner.stop('customerlist');
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
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
              permissionval.formName == 'CustomerWiseVisitReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectfrom() {
    this.enddate = new Date();
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.resultColumns = [];

    this.filterData.page = 1;
    this.filterData.companyMasterID = this.datefilter.value.company;
    this.filterData.startDate = this.datefilter.value.fromdate;
    this.filterData.endDate = this.datefilter.value.todate;
    this.filterData.customerID = this.datefilter.value.customerlist;

    this.getData();
  }

  getData() {
    this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETVISITREPORTBYCUSTMOER, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('submit');
          } else {
            this.handleError(res.message);
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('submit');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getData();
    } else {
      console.log('error');
    }
  }
  clear() {
    window.location.reload();
  }

  download() {
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.datefilter.value.company,
      customerID: this.datefilter.value.customerlist,
      startDate: this.datefilter.value.fromdate,
      endDate: this.datefilter.value.todate,
      exportData: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.GETVISITREPORTBYCUSTMOER, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Visit Report Customerwise.xlsx');
    this.spinner.stop('download');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
