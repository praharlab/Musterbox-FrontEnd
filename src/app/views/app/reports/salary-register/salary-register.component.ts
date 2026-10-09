import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-salary-register',
    templateUrl: './salary-register.component.html',
    styleUrls: ['./salary-register.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SalaryRegisterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
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
    yearmonth: '',
    userMasterID: [],
    orderby: [],
    companyMasterID: '',
    branchMasterID: '',
    departmentid: '',
    divisionId: '',
    report: 'salaryRegister',
    fieldNames: [],
    // salaryType: []
  };
  body = {
    page: 1,
    limit: 10,
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
  alldepartment: any;
  selectedEmployees: any[];
  selectedDepart: string;
  selectedBranch: string;
  currentPage: number;
  allDivision: any = [];
  selectedDivision: string;
  fieldDropdown: any = ['Employee Code', 'Branch', 'Department', 'Designation', 'Mobile No', 'Gender', 'Joining Date', 'Salary Type', 'Account No.', 'IFSC No', 'ESIC No', 'UAN No'];
  selectedSalaryType: any = [];
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    divisionId: ''
  }
  selectedfields: any = [];


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

    this.selectedfields = this.fieldDropdown
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.getcompany();
    this.getorderby();
  }

  getorderby() {
    this.orderby = [];
    this.orderby.push('Employee Name', 'Branch', 'Department', 'Designation');
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
              permissionval.formName == 'SalaryRegisterReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getUsers() {

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
        }
        this.spinner.stop('users');
      });
  }

  selectcompany(id) {
    this.allbranch = [];
    this.alldepartment = [];
    this.alluser = [];
    this.allDivision = [];
    this.users_Body.companyMasterID = '';
    this.users_Body.branchMasterID = '';
    this.users_Body.departmentID = '';
    this.users_Body.divisionId = '';
    (this.selectedEmployees = []), (this.selectedDepart = ''), (this.selectedBranch = ''), this.selectedDivision = '';

    if (id) {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        });
      this.spinner.start('depart');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldepartment = res.data;
            this.spinner.stop('depart');
          }
        });

      this.spinner.start('Division');
      this.api
        .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allDivision = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('Division');
        });

      this.users_Body.companyMasterID = id;
      this.getUsers();
    }
  }

  selectbranch(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.branchMasterID = id;
    this.getUsers();
  }

  selectdepart(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.departmentID = id;
    this.getUsers();
  }

  selectdivision(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.divisionId = id;
    this.getUsers();
  }

  getData() {
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.SALARYREGISTERREPORT, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.filter = 'filter';
            this.rows = res.data;

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
          }
          this.spinner.stop('getdata');
        },
        (err) => {
          this.spinner.stop('getdata');
        },
      );
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.resultColumns = [];

    this.filterData.page = 1;

    this.filterData.companyMasterID = this.datefilter.value.cid;
    this.filterData.branchMasterID = this.datefilter.value.branch;
    this.filterData.departmentid = this.datefilter.value.department;
    this.filterData.divisionId = this.datefilter.value.division;
    this.filterData.userMasterID = this.datefilter.value.user ? this.datefilter.value.user : [];
    this.filterData.yearmonth = this.datefilter.value.YearMM.replace('-', '');
    this.filterData.orderby = this.datefilter.value.orderBy ? this.datefilter.value.orderBy : [];
    this.filterData.fieldNames = this.selectedfields,
      // this.filterData.salaryType = this.selectedSalaryType

    this.getData();
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

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  download() {
    const filterData = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      yearmonth: this.filterData.yearmonth,
      orderby: this.filterData.orderby,
      companyMasterID: this.filterData.companyMasterID,
      branchMasterID: this.filterData.branchMasterID,
      departmentid: this.filterData.departmentid,
      divisionId: this.filterData.divisionId,
      report: 'salaryRegister',
      Export: 'true',
      fieldNames: this.filterData.fieldNames,
      // salaryType: this.filterData.salaryType
    };

    this.spinner.start('a');
    this.api
      .callApi(this.constant.SALARYREGISTERREPORT, filterData, 'POST', true, true, true, true)
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
            saveAs(blob, `Salary Register - ${filterData.yearmonth}.xlsx`);

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

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }
}
