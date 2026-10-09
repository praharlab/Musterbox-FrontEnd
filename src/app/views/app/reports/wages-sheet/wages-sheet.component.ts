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
    selector: 'app-wages-sheet',
    templateUrl: './wages-sheet.component.html',
    styleUrls: ['./wages-sheet.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WagesSheetComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
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
    yearmonth: '',
    userMasterID: [],
    orderby: [],
    companyMasterID: '',
    branchMasterID: '',
    departmentid: '',
    divisionId: '',
    contractorId:[],
    report: 'wagesSheet',
    fieldNames: ['Employee Code','Designation','Gender'],
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
 
  selectedSalaryType: any = [];
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    divisionId: '',
    contractorId:[]
  }
  selectedfields: any = [];
  allContractor: any;
  selectedContractor: any[] = [];


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
              permissionval.formName == 'SalaryWagesSheet' &&
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
    this.allContractor = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alluser = [];
    this.allDivision = [];
    this.users_Body.companyMasterID = '';
    this.users_Body.branchMasterID = '';
    this.users_Body.departmentID = '';
    this.users_Body.divisionId = '';
    this.users_Body.contractorId = [];
    (this.selectedEmployees = []), (this.selectedDepart = ''), (this.selectedBranch = ''), this.selectedDivision = '',this.selectedContractor = [];

    if (id) {

      this.spinner.start('contractor');
      this.api
        .callApi(this.constant.GETALLDATA + `?companyMasterID=${id}`, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allContractor = res.data;
          this.selectAllForDropdownItems(this.allContractor);
          this.spinner.stop('contractor');
        });

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

  selectcontractor(){
    this.alluser = [];
    this.selectedEmployees = [];
    this.users_Body.contractorId = this.selectedContractor;
    this.getUsers(); 
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
            let base64String = res.data;
            this.downloadPdf(base64String, 'Salary Wages Sheet');
          }
          this.spinner.stop('getdata');
        },
        (err) => {
          this.spinner.stop('getdata');
        },
      );
  }

  convertBase64ToBlob(base64String: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }

  downloadPdf(base64String: string, fileName: string) {


    const blob = this.convertBase64ToBlob(base64String);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }


    this.filterData.companyMasterID = this.datefilter.value.cid;
    this.filterData.contractorId = this.selectedContractor;
    this.filterData.branchMasterID = this.datefilter.value.branch;
    this.filterData.departmentid = this.datefilter.value.department;
    this.filterData.divisionId = this.datefilter.value.division;
    this.filterData.userMasterID = this.datefilter.value.user ? this.datefilter.value.user : [];
    this.filterData.yearmonth = this.datefilter.value.YearMM.replace('-', '');
    // this.filterData.orderby = this.datefilter.value.orderBy ? this.datefilter.value.orderBy : [];
    // this.filterData.fieldNames = this.selectedfields,
    //   // this.filterData.salaryType = this.selectedSalaryType

    this.getData();
  }

 

 

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }


  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }
}
