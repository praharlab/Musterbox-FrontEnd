import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-gatepass-dashboard',
    templateUrl: './gatepass-dashboard.component.html',
    styleUrls: ['./gatepass-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GatepassDashboardComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;

  rows = [];
  rows2 = [];
  company_id: any;
  branch_id: any;
  company: any;
  startdate: string;
  body1 = {
    companyMasterID: '',
    branchMasterID: '',
    date: '',
  };
  bName: any;
  defaultValue: {};
  employeedata: any;
  allbranch: any;
  employee: any;
  defaultValue2: {};

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.startdate = new Date().toISOString().slice(0, 10);
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();

    this.getdashboardData();

    this.defaultValue = {
      cName: Number(this.company_id),
      tDate: this.startdate,
    };
    this.defaultValue2 = {
      cName: Number(this.company_id),
    };
  }

  getcompany() {
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

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + this.company_id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop();
      });
  }

  selectcompany(id) {
    this.bName = '';
    this.employee = [];
    this.allbranch = [];
    this.employeedata = [];
    if (id) {
      let bb = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
          }
        });

      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop();
        });
    }
  }

  selectbranch(id) {
    this.employeedata = [];
    let bb = {
      branchMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeedata = res.data;
          this.spinner.stop();
        }
      });
  }

  getdashboardData() {
    (this.body1.companyMasterID = this.company_id),
      (this.body1.branchMasterID = ''),
      (this.body1.date = this.startdate),
      this.spinner.start();
    this.api
      .callApi(this.constant.GATEPASSDASHBOARD, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop();
        }
      });
  }

  onChange() {
    if (!this.datefilter.valid) {
      return;
    }
    (this.body1.companyMasterID = this.datefilter.value.cid),
      (this.body1.branchMasterID = this.datefilter.value.bid),
      (this.body1.date = this.datefilter.value.startdate),
      this.spinner.start();
    this.api
      .callApi(this.constant.GATEPASSDASHBOARD, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.spinner.stop();
        }
      });
  }
}
