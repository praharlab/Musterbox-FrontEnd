import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
@Component({
    selector: 'app-form29',
    templateUrl: './form29.component.html',
    styleUrls: ['./form29.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form29Component implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  scrollBarHorizontal: boolean;
  company_id: string;
  company1: any;
  permissionview: any = [];
  rows: any = [];
  fromMonth: any;
  result: any;
  toMonth: any;
  result1: any;
  company: any;
  Branch: any;
  finaldata: boolean = false;
  branch: any = [];
  companyData: any;
  branch1: any;
  limit: 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  // filterData ={
  //   page: 1,
  //   limit: 10,
  //   branchid:"",
  //   startdate:"",
  //   enddate:"",
  // }
  filterData = {
    branchMasterID: '',
    startdate: '',
    enddate: '',
  };
  Form_29: any = [];
  companydata: any;
  apiURL = environment.apiUrl;
  resultColumns = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
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
          this.company1 = res.data;

          this.spinner.stop();
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
              permissionval.formName == 'Form-29' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.branch = res;

        this.spinner.stop('branch');
      });

    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
        }
      });
  }
  selectBranch() {
    this.api
      .callApi(
        this.constant.VIEWBRANCH + this.datefilter.value.branchID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.branch1 = res.data;
        }
      });
  }

  onSubmit() {
    this.rows = [];

    (this.filterData.branchMasterID = this.datefilter.value.branchID),
      (this.filterData.startdate = this.datefilter.value.fromyearmonth),
      (this.filterData.enddate = this.datefilter.value.toyearmonth),
      this.spinner.start('submit');
    this.api
      .callApi(this.constant.GETFORM_29, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.Form_29 = res.data;
          this.page.totalCount = res.totalcount;
          this.spinner.stop('submit');
        }
      });
  }

  savePdf() {
    window.print();
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
      this.rows = [];
      this.Form_29 = [];
    }, 100);
  }
}
