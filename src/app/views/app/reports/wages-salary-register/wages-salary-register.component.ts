import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-wages-salary-register',
    templateUrl: './wages-salary-register.component.html',
    styleUrls: ['./wages-salary-register.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WagesSalaryRegisterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
  rows = [];
  temp = [];
  itemsPerPage = 50;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 50;
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  filterData = {
    companyMasterID: '',
    page: 1,
    limit: 50,
    yearmonth: '',
    showdata: '',
    employeement: [],
    salarytype: '',
    branchMasterID: [],
    divisionId: '',
  };
  body = {
    page: 1,
    limit: 50,
    searchQuery: '',
    companyMasterID: '',
    YearMM: '',
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
  salarydata: any;
  show1: boolean;
  showdataList: any = ['Department', 'Designation'];
  attcomp: any;
  attyear: any;
  salaryslipshow: number;
  alluser: any;
  allbranch: any;
  selected: any[];
  ipAddress: any;
  rows1 = [];
  earningside_salarystructure: void;
  earning: any[];
  deduction: any[];
  otherfield: any[];
  export: any;
  orderby: any[];
  companydata: any;
  dataValue: any;
  selectedCompany: string;
  visibleData: boolean = true;
  selectedBranch: any;
  month: any;
  branch1: any;
  yearmonth1: string;
  finaltotal: any;
  employeement: any[];
  selectedemp: any[];
  selected3: any[];
  tempID: any = [];
  showdata: any;
  selectedshowdata: any;
  currentPage: number;
  registerData: string;
  allDivision: any;
  selectedBranches: any[];
  selectedDivision: String = '';

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
    this.getemployeement();
    this.selectedshowdata = this.showdataList;
  }

  getemployeement() {
    this.employeement = [];
    this.employeement = labelUtils.EmployementType;
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
              permissionval.formName == 'WagesSalaryRegister' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    this.allbranch = [];
    this.allDivision = [];
    this.selectedBranches = [];
    this.selectedDivision = '';
    if (!id) {
      return;
    } else {
      this.company.forEach((element) => {
        if (element.companyMasterID == id) {
          this.selectedCompany = element.companyName;
        }
      });

      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;

          this.selectAllForDropdownItems(this.allbranch);
          let data1 = [];
          this.allbranch.forEach(async (rating) => {
            data1.push(rating.branchMasterID);
          });
          this.selected3 = data1;
          this.spinner.stop('branch');
        });

      this.spinner.start('Division');
      this.api
        .callApi(
          this.constant.LISTDIVISION + '?companyMasterID=' + id + '&status=1',
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          this.allDivision = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('Division');
        });
    }
  }

  selectbranch(id) {
    if (id.target) {
      return;
    }

    this.tempID = [];

    for (let i = 0; i < id.length; i++) {
      this.tempID.push(id[i].branchMasterID);
    }

    if (this.tempID.length == 1) {
      this.api
        .callApi(this.constant.VIEWBRANCH + this.tempID[0], {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.branch1 = res.data;
          }
        });
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    // this.rows = []
    this.resultColumns = [];

    if (this.datefilter.value.fromdate) {
      this.filterData.employeement = this.datefilter.value.fromdate.map((str) => `'${str}'`);
    }

    this.filterData.yearmonth = this.datefilter.value.YearMM.replace('-', '');
    // this.filterData.employeement = this.datefilter.value.fromdate;
    this.filterData.salarytype = this.datefilter.value.salarytype;
    this.filterData.showdata = this.selectedshowdata;
    this.filterData.branchMasterID = this.tempID;
    this.filterData.divisionId = this.datefilter.value.division;
    this.filterData.companyMasterID = this.datefilter.value.cid;

    this.spinner.start('submit');

    this.api
      .callApi(this.constant.WAGESSALARYREGISTER, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;

          // this.month = this.rows.length > 0 ? this.rows[0].month : '';

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);

          for (var key in this.rows[0]) {
            this.resultColumns.push({
              name: key,
              prop: key,
              flexGrow: 1.2,
              minWidth: 200,
            });
          }

          this.spinner.stop('submit');
        } else {
          this.spinner.stop('submit');
        }
      });
  }

  onChange(e: any) {
    if (this.filter == 'filter') {
      this.filterData.page = e.offset + 1;
      this.onSubmit();
    } else {
      this.filter.page = 1;
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'filter') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;

      this.onSubmit();
    } else {
      this.filter.page = 1;
      console.log('error');
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  download() {
    const body = {
      yearmonth: this.filterData.yearmonth,
      page: '',
      limit: '',
      employeement: this.filterData.employeement,
      salarytype: this.filterData.salarytype,
      branchMasterID: this.filterData.branchMasterID,
      divisionId: this.filterData.divisionId,
      companyMasterID: this.filterData.companyMasterID,
      showdata: this.filterData.showdata,
      exportPdf: true,
    };

    this.spinner.start('main');
    this.api
      .callApi(this.constant.WAGESSALARYREGISTER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.data) {
          this.registerData = 'data:application/pdf;base64,' + res.data;
          this.onClickDownloadPdf();
          this.spinner.stop('main');
        } else {
        }
      });
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}-${this.filterData.yearmonth}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.registerData;
    this.downloadPdf(base64String, 'Wages Salary Register');
  }

  clear() {
    this.datefilter.resetForm();
    (this.allbranch = []),
      (this.allDivision = []),
      setTimeout(() => {
        this.registerData = '';
        this.limit = 50;
        this.page = {
          totalCount: 0,
          offset: 0,
        };
        this.filterData = {
          page: 1,
          limit: 50,
          yearmonth: '',
          showdata: '',
          employeement: [],
          salarytype: '',
          branchMasterID: [],
          divisionId: '',
          companyMasterID: '',
        };

        this.ngOnInit();
      }, 200);
  }
}
