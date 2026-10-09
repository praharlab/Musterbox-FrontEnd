import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-overtime-report',
    templateUrl: './overtime-report.component.html',
    styleUrls: ['./overtime-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OvertimeReportComponent implements OnInit {
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('editovertime') editovertime: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    yyyymm: '',
    branchMasterID: '',
  };

  events: any;
  childcompany: any;
  company_id: any;
  cid: any;
  company: any;
  usertype: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  resultColumns: any = [];
  overtimedata: any;
  allbranch: any;
  alluser: any;
  selected: any[];
  ipAddress: any;
  rows1: any[];
  selectedBranch: any = '';
  export: any;
  flag: boolean = false;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');

    this.checkpermission();
    this.getcompany();
    this.getIPAddress();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  changemonth() {
    this.rows = [];
  }

  selectcompany(id) {
    this.allbranch = [];
    this.selectedBranch = '';
    this.selected = [];
    this.alluser = [];
    this.rows = [];

    if (id) {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
        });
      this.spinner.stop('branch');
    }
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
              permissionval.formName == 'OvertimeReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.flag = true;
    this.filterData.companyMasterID = this.datefilter.value.cid;
    this.filterData.yyyymm = this.datefilter.value.yyyymm.replace('-', '');

    this.filterData.branchMasterID = this.datefilter.value.branch;

    this.spinner.start('overtimereport');

    this.api
      .callApi(this.constant.OVERTIMEREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop('overtimereport');
        }
      });
  }

  // onItemsPerPageChange(itemCount): void {
  //   this.itemsPerPage = itemCount
  // }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.onSubmit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    this.onSubmit();
  }

  download() {
    const filterData = {
      companyMasterID: this.filterData.companyMasterID,
      yyyymm: this.filterData.yyyymm,
      branchMasterID: this.filterData.branchMasterID,
      Export: 'true',
    };
    this.spinner.start('id');
    this.api
      .callApi(this.constant.OVERTIMEREPORT, filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('id');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Overtime Report - ${this.filterData.yyyymm}.xlsx`);

            this.spinner.stop('id');
          }
        },
        (err) => {
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
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
