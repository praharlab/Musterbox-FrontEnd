import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';

@Component({
    selector: 'app-employee-month-wise-salary-report',
    templateUrl: './employee-month-wise-salary-report.component.html',
    styleUrls: ['./employee-month-wise-salary-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeMonthWiseSalaryReportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  scrollBarHorizontal: boolean;
  permissionview: any = [];
  company_id: string;
  company: any;

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
  comp_query: string;
  alluser: any;
  brach_query: string;
  selectedStatus: any = '1';
  selectedUser: any[];
  allbranch: any[];
  alldepartment: any;
  allWorkingArea: any;
  alldesignation: any;
  allDivision: any;
  selectedDepartment: any[];
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedCompany: any;
  selectedBranch: string;
  selectedEmployees: any[];
  selectedBranch1: any;
  startDate: string;
  endDate: string;
  startmonth: any;
  endmonth: any;
  currmonth: any;
  // body = {
  //   userId: '',
  //   startMonth: '',
  //   endMonth: '',
  //   dayType: '',
  // };
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
    status: '1'
  }
  body = {
    userMasterID: '',
    companyMasterID: '',
    branchMasterID: '',
    page: 1,
    limit: 10,
    exportData: '',
    dayType: '',
    endMonth: '',
    startMonth: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  query: string;
  rows: any = [];
  resultColumns: any;

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
    this.company_id = localStorage.getItem('company_id');
    this.body.exportData = ''
    this.checkpermission();
    this.getcompany();
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
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
              permissionval.formName == 'EmployeeWiseSalaryReport' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
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
  }

  getUserByCompany() {
    const body = {
      employeeStartDate: this.comp_body.startdate,
      employeeEndDate: this.comp_body.enddate,
      companyMasterID: this.comp_body.companyMasterID,
    };

    this.spinner.start('emp');
    this.api
      .callApi(
        this.constant.GETALLUSERS,
        body,
        'POST',
        true,
        false,
        true,
      )
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
      .callApi(
        this.constant.GETALLUSERS,
        body,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          // this.selectAllForDropdownItems(this.alluser);
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
    this.selectedEmployees = [];
    this.selectedBranch = '';
    this.selectedCompany = id;
    this.users_Body.companyMasterID = id;
    if (id) {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
        });
      this.spinner.stop('branch');

      this.spinner.start('dep');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.alldepartment = res.data;
        this.selectAllForDropdownItems(this.alldepartment);
        this.spinner.stop('dep');
      });


    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.selectAllForDropdownItems(this.alldesignation);
          this.spinner.stop('desig');
        }
      });


    this.spinner.start('workingArea');
    this.api
      .callApi(this.constant.LISTWORKINGAREA + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;
        this.selectAllForDropdownItems(this.allWorkingArea);

        this.spinner.stop('workingArea');
      });

    this.spinner.start('Division');
    this.api
      .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allDivision = res.data;
        this.selectAllForDropdownItems(this.allDivision);
        this.spinner.stop('Division');
      });

      this.comp_body.companyMasterID = id;

      this.comp_body.startdate = this.startDate;
      this.comp_body.enddate = this.endDate;

      this.getUsers();
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

      this.getUsers();
    } else {
      if (this.selectedCompany) {
        this.comp_body.companyMasterID = this.selectedCompany;
        this.comp_body.startdate = this.datefilter.value.startdate;
        this.comp_body.enddate = this.datefilter.value.enddate;

        this.getUsers();
      }
    }
  }

  selectdate() {
    if (this.datefilter.value.startmonth && !this.datefilter.value.endmonth) {
      this.currmonth =
        new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2);
      this.datefilter.value.endmonth = this.currmonth;
    }

    if (this.datefilter.value.startmonth && this.datefilter.value.endmonth) {
      this.startmonth = this.datefilter.value.startmonth.replace('-', '');
      this.endmonth = this.datefilter.value.endmonth.replace('-', '');

      this.startDate =
        this.startmonth.toString().slice(0, 4) +
        '-' +
        this.startmonth.toString().slice(4, 6) +
        '-' +
        '01';
      this.endDate =
        this.endmonth.toString().slice(0, 4) +
        '-' +
        this.endmonth.toString().slice(4, 6) +
        '-' +
        this.daysInMonth(this.endmonth.slice(4, 6), this.endmonth.slice(0, 4));

      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.currmonth = '';
        return this.notifications.create(
          '',
          'EndMonth must be grater or equal to ToMonth',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      }

      if (this.selectedCompany && this.selectedBranch1) {
        this.branch_body.branchMasterID = this.selectedBranch1;
        this.branch_body.startdate = this.startDate;
        this.branch_body.enddate = this.endDate;

        this.getUsers();
      } else if (this.selectedCompany && !this.selectedBranch1) {
        this.comp_body.companyMasterID = this.selectedCompany;
        this.comp_body.startdate = this.startDate;
        this.comp_body.enddate = this.endDate;

        this.getUsers();
      }
    }
  }

  submit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.resultColumns = [];

    this.spinner.start('submit');

    this.body.companyMasterID = this.datefilter.value.cid 
    this.body.startMonth = this.startmonth
    this.body.endMonth=this.endmonth
    this.body.userMasterID = this.datefilter.value.user
    this.body.dayType = this.datefilter.value.dayType
    this.api
    .callApi(this.constant.EMPLOYEEMONTHWISESALRYREPORT, this.body, 'POST', true, false, true, this.body.exportData == 'excel' ? true : false)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.body.exportData = '';
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Employee Month Wise Salary Report.xlsx`);
            this.spinner.stop('submit');
          } else {
            if (res.status == 200) {
              if(this.body.exportData == 'pdf'){
                let base64String = res.data;
                this.body.exportData = '';
                this.downloadPdf(base64String, 'Employee Month Wise Salary Report');
                this.spinner.stop('submit');
              }
              else{
                this.spinner.stop('submit');
                this.rows = res.data;
                this.page.totalCount = res.totalCount;
                this.body.exportData = ''
              }
            }
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
          this.spinner.stop('submit');
        },
      );
  }

  Export(file: any) {
    // this.spinner.start('a');
    this.body.exportData = file;
    this.submit()
  }

  excelHandel(res: any) {
    if (res.type == 'application/json') {
      this.notifications.create('No data found to export!', '', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    } else {
      var blob = new Blob([res], { type: 'text/xlsx' });
      saveAs(blob, `Employee Month Wise Salary Report ${this.startmonth}-${this.endmonth}.xlsx`);
    }
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

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  selectdepartment() {
    this.alluser = [];
    this.selectedUser = []
    this.users_Body.departmentID = this.datefilter.value.department;
    this.getUsers();
  }


  selectdesig() {
    this.alluser = [];
    this.selectedUser = []
    this.users_Body.designationID = this.datefilter.value.designation;
    this.getUsers();
  }


  selectdivision() {
    this.alluser = [];
    this.selectedUser = []
    this.users_Body.divisionId = this.datefilter.value.division;
    this.getUsers();
  }

  selectWorkingArea() {
    this.alluser = [];
    this.selectedUser = []
    this.users_Body.workingAreaId = this.datefilter.value.workingArea;
    this.getUsers();
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.rows = [];
      this.body = { userMasterID: '', companyMasterID: '', branchMasterID: '', page: 1, limit: 10, exportData: '', startMonth: '', endMonth: '', dayType: '' };
      this.users_Body = {
        companyMasterID: '',
        branchMasterID: [],
        departmentID: [],
        designationID: [],
        divisionId: [],
        workingAreaId: [],
        status: '1'
      }
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  getUsers() { 
    this.users_Body.branchMasterID = this.datefilter.value.branch;
    this.users_Body.departmentID = this.datefilter.value.department;
    this.users_Body.designationID = this.datefilter.value.designation;
    this.users_Body.divisionId = this.datefilter.value.division;
    this.users_Body.workingAreaId = this.datefilter.value.workingArea;
    this.users_Body.companyMasterID = this.datefilter.value.cid;
    this.users_Body.status = this.datefilter.value.status;
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

  selectStatus() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.status = this.selectedStatus ? this.selectedStatus.toString() : '1';
    this.getUsers();
  }

  onChange(event: any) {
    this.body.page = event.page;
    this.submit();
  }

  onLimitChange(ev: any) {
    if(!this.rows) return;
    if (ev) {
      this.body.limit = ev;
      this.submit();
    }
  }
}
