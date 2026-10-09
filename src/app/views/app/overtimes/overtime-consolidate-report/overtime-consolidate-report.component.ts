import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-overtime-consolidate-report',
    templateUrl: './overtime-consolidate-report.component.html',
    styleUrls: ['./overtime-consolidate-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OvertimeConsolidateReportComponent implements OnInit {
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('editovertime') editovertiome: NgForm;
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
  comp_body = {
    startdate: '',
    enddate: '',
    companyMasterID: '',
  };
  branch_body = {
    startdate: '',
    enddate: '',
    branchMasterID: '',
  };
  events: any;
  filter: any;
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
  allemployee: any;
  alluser: any;
  selected: any[];
  ipAddress: any;
  rows1: any[];
  selectedBranch: any = '';
  export: any;
  flag: boolean = false;
  selectedEmployee: any;
  today: any = new Date().toISOString().substring(0, 7);
  selectedCompany: any;
  query: string;
  comp_query: string;
  brach_query: string;
  selectedBranch1: any;
  selectedEmployees: any = [];
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

  getUserByCompany() {
    const body = {
      employeeStartDate: this.comp_body.startdate,
      employeeEndDate: this.comp_body.enddate,
      companyMasterID: this.comp_body.companyMasterID,
    };

    this.spinner.start('emp');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((e) => {
            e.userName = e['userMaster.displayName'];
          });
          this.spinner.stop('emp');
        } else {
          this.spinner.stop('emp');
        }
      });
  }

  getUserByBranch() {
    // let querystring = this.branch_body.branchMasterID
    //   ? `?branchMasterID=${this.branch_body.branchMasterID}`
    //   : '';

    // if (this.branch_body.startdate && this.branch_body.enddate) {
    //   querystring += `&startdate=${this.branch_body.startdate}&enddate=${this.branch_body.enddate}`;
    // }

    // this.brach_query = querystring;

    let body = {
      branchStartDate: this.branch_body.startdate,
      branchEndDate: this.branch_body.enddate,
      branchMasterID: this.branch_body.branchMasterID,
    };

    this.spinner.start('branchuser');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((e) => {
            e.userName = e['userMaster.displayName'];
          });
          this.spinner.stop('branchuser');
        } else {
          this.spinner.stop('branchuser');
        }
      });
  }

  selectcompany(id) {
    this.allbranch = [];
    this.alluser = [];
    this.selectedCompany = id;
    if (id) {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
        });
      this.spinner.stop('branch');

      this.comp_body.companyMasterID = id;
      this.comp_body.startdate = this.datefilter.value.startdate;
      this.comp_body.enddate = this.datefilter.value.enddate;

      this.getUserByCompany();
    } else {
      this.selectedBranch = '';
      this.selectedEmployees = [];
    }
  }

  selectbranch(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.selectedBranch1 = id;
    if (id) {
      this.branch_body.branchMasterID = id;
      this.branch_body.startdate = this.datefilter.value.startdate;
      this.branch_body.enddate = this.datefilter.value.enddate;

      this.getUserByBranch();
    } else {
      if (this.selectedCompany) {
        this.comp_body.companyMasterID = this.selectedCompany;
        this.comp_body.startdate = this.datefilter.value.startdate;
        this.comp_body.enddate = this.datefilter.value.enddate;

        this.getUserByCompany();
      }
    }
  }

  selectdate() {
    if (this.datefilter.value.startdate && this.datefilter.value.enddate) {
      if (this.selectedCompany && this.selectedBranch1) {
        this.branch_body.branchMasterID = this.selectedBranch1;
        this.branch_body.startdate = this.datefilter.value.startdate;
        this.branch_body.enddate = this.datefilter.value.enddate;

        this.getUserByBranch();
      } else if (this.selectedCompany && !this.selectedBranch1) {
        this.comp_body.companyMasterID = this.selectedCompany;
        this.comp_body.startdate = this.datefilter.value.startdate;
        this.comp_body.enddate = this.datefilter.value.enddate;

        this.getUserByCompany();
      }
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
              permissionval.formName == 'ConsolidateOverTimeReport' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  Export() {
    if (!this.datefilter.valid) {
      return;
    }

    const body = {
      companyMasterID: this.datefilter.value.cid,
      startDate: this.datefilter.value.startdate,
      endDate: this.datefilter.value.enddate,
      branchMasterID: this.datefilter.value.branch,
      userMasterID: this.datefilter.value.employee,
      Export: 'true'
    }

    this.spinner.start('a');



    this.api
      .callApi(
        this.constant.GETOVERTIMECONSOLIDATEREPORT,
        body,
        'POST',
        true,
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'Cosolidate_OT_Report.xlsx');

            this.spinner.stop('a');
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
          this.spinner.stop('a');
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
}
