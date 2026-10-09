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
    selector: 'app-leave-balance-summary-report',
    templateUrl: './leave-balance-summary-report.component.html',
    styleUrls: ['./leave-balance-summary-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LeaveBalanceSummaryReportComponent implements OnInit {
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
  allbranch: any[];
  selectedCompany: any;
  selectedEmployees: any[];
  selectedBranch1: any;
  startDate: string;
  endDate: string;
  startmonth: any;
  endmonth: any;
  currmonth: any;
  allWorkingArea: any;
  alldesignation: any;
  alldepartment: any;
  allDivision: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: []
  }
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];
 

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

    this.checkpermission();
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
      departmentID: [],
      designationID: [],
      divisionId: [],
      workingAreaId: []
    }
    this.alluser = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = []
    this.allDivision = []
    this.allWorkingArea = []

    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
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
              permissionval.formName == 'LeaveBalanceSummaryReport' &&
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

  getUsers() {
  
      this.users_Body.branchMasterID = this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0 ? this.users_Body.branchMasterID : null
      this.users_Body.departmentID = this.users_Body.departmentID && this.users_Body.departmentID.length > 0 ? this.users_Body.departmentID : null
      this.users_Body.designationID = this.users_Body.designationID && this.users_Body.designationID.length > 0 ? this.users_Body.designationID : null
      this.users_Body.divisionId = this.users_Body.divisionId && this.users_Body.divisionId.length > 0 ? this.users_Body.divisionId : null
      this.users_Body.workingAreaId = this.users_Body.workingAreaId && this.users_Body.workingAreaId.length > 0 ? this.users_Body.workingAreaId : null
  
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            // this.showForm = true;
            this.selectAllForDropdownItems(this.alluser);
          }
          this.spinner.stop('users');
        });
    }
  
    selectcompany(id: any) {
      this.alluser = [];
      this.allbranch = [];
      this.alldepartment = [];
      this.alldesignation = []
      this.allDivision = []
      this.allWorkingArea = []
  
      this.selectedBranch = [];
      this.selectedDepartment = [];
      this.selectedUser = [];
      this.selecteddesig = [];
      this.selectedDivision = [];
      this.selectedWorkingArea = [];
  
      this.users_Body = {
        companyMasterID: '',
        branchMasterID: null,
        departmentID: null,
        designationID: null,
        divisionId: null,
        workingAreaId: null
      }
  
      if (!id) return;
     
      this.spinner.start('dep');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.alldepartment = res.data;
          this.selectAllForDropdownItems(this.alldepartment);
          this.spinner.stop('dep');
        });
  
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.selectAllForDropdownItems(this.allbranch);
          this.spinner.stop('branch');
        });
  
        this.spinner.start('desig')
        this.api
          .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.alldesignation = res.data;
              this.selectAllForDropdownItems(this.alldesignation);
    
              // this.page.totalCount = res.totalcount;
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
    
            // this.page.totalCount = res.totalcount;
            this.spinner.stop('Division');
          });
    
        this.users_Body.companyMasterID = id;
        this.getUsers();
    }
  
    selectbranch() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.branchMasterID = this.datefilter.value.branch;
      this.getUsers();
    }
  
    selectdepartment() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.departmentID = this.datefilter.value.department;
      this.getUsers();
    }
  
  
    selectdesig() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.designationID = this.datefilter.value.designation;
      this.getUsers();
    }
  
  
    selectdivision() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.divisionId = this.datefilter.value.division;
      this.getUsers();
    }
  
    selectWorkingArea() {
      this.alluser = [];
      this.selectedUser = [];
      this.users_Body.workingAreaId = this.datefilter.value.workingArea;
      this.getUsers();
    }

  // getUserByCompany() {
  //   let body = {
  //     employeeStartDate: this.comp_body.startdate,
  //     employeeEndDate: this.comp_body.enddate,
  //     companyMasterID: this.comp_body.companyMasterID,
  //   };
  //   this.spinner.start('emp');
  //   this.api
  //     .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.alluser = res.data;
  //         this.selectAllForDropdownItems(this.alluser);
  //         this.alluser.map((e) => {
  //           e.userName = e['userMaster.displayName'];
  //         });
  //         this.spinner.stop('emp');
  //       } else {
  //         this.spinner.stop('emp');
  //       }
  //     });
  // }

  // getUserByBranch() {
  //   // let querystring = this.branch_body.branchMasterID
  //   //   ? `?branchMasterID=${this.branch_body.branchMasterID}`
  //   //   : '';

  //   // if (this.branch_body.startdate && this.branch_body.enddate) {
  //   //   querystring += `&startdate=${this.branch_body.startdate}&enddate=${this.branch_body.enddate}`;
  //   // }

  //   // this.brach_query = querystring;

  //   let body = {
  //     branchStartDate: this.branch_body.startdate,
  //     branchEndDate: this.branch_body.enddate,
  //     branchMasterID: this.branch_body.branchMasterID,
  //   };

  //   this.spinner.start('branchuser');
  //   this.api
  //     .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.alluser = res.data;
  //         this.selectAllForDropdownItems(this.alluser);
  //         this.alluser.map((e) => {
  //           e.userName = e['userMaster.displayName'];
  //         });
  //         this.spinner.stop('branchuser');
  //       } else {
  //         this.spinner.stop('branchuser');
  //       }
  //     });
  // }

  // selectcompany(id) {
  //   this.allbranch = [];
  //   this.alluser = [];
  //   this.selectedEmployees = [];
  //   this.selectedBranch = '';
  //   this.selectedCompany = id;
  //   if (id) {
  //     this.spinner.start('branch');
  //     this.api
  //       .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //       .subscribe((res: any) => {
  //         this.allbranch = res;
  //       });
  //     this.spinner.stop('branch');

  //     this.comp_body.companyMasterID = id;

  //     this.comp_body.startdate = this.startDate;
  //     this.comp_body.enddate = this.endDate;

  //     this.getUserByCompany();
  //   } else {
  //     this.selectedBranch = '';
  //     this.selectedEmployees = [];
  //   }
  // }

  // selectbranch(id) {
  //   this.alluser = [];
  //   this.selectedEmployees = [];
  //   this.selectedBranch1 = id;
  //   if (id) {
  //     this.branch_body.branchMasterID = id;
  //     this.branch_body.startdate = this.datefilter.value.startdate;
  //     this.branch_body.enddate = this.datefilter.value.enddate;

  //     this.getUserByBranch();
  //   } else {
  //     if (this.selectedCompany) {
  //       this.comp_body.companyMasterID = this.selectedCompany;
  //       this.comp_body.startdate = this.datefilter.value.startdate;
  //       this.comp_body.enddate = this.datefilter.value.enddate;

  //       this.getUserByCompany();
  //     }
  //   }
  // }

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

      // if (this.selectedCompany && this.selectedBranch1) {
      //   this.branch_body.branchMasterID = this.selectedBranch1;
      //   this.branch_body.startdate = this.startDate;
      //   this.branch_body.enddate = this.endDate;

      //   this.getUserByBranch();
      // } else if (this.selectedCompany && !this.selectedBranch1) {
      //   this.comp_body.companyMasterID = this.selectedCompany;
      //   this.comp_body.startdate = this.startDate;
      //   this.comp_body.enddate = this.endDate;

      //   this.getUserByCompany();
      // }
    }
  }

  Export() {
    if (!this.datefilter.valid) {
      return;
    }

    const body = {
      companyMasterID:this.datefilter.value.cid,
      userMasterID:this.datefilter.value.user,
      startMonth:this.startmonth,
      endMonth:this.endmonth
    }

    this.spinner.start('a');

    // let queryString = `?companyMasterID=${this.datefilter.value.cid}`;

    // if (this.datefilter.value.startmonth && this.datefilter.value.endmonth) {
    //   queryString += `&startMonth=${this.startmonth}&endMonth=${this.endmonth}`;
    // }

    // if (this.datefilter.value.branch) {
    //   queryString += `&branchMasterID=${this.datefilter.value.branch}`;
    // }

    // if (this.datefilter.value.employee.length > 0) {
    //   this.datefilter.value.employee.map((e) => {
    //     queryString += `&userMasterID[]=${e}`;
    //   });
    // }

    this.api
      .callApi(
        this.constant.GETLEAVEBALANCESUMMARYREPORT ,
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
            saveAs(blob, `leave_Balance_Report ${this.startmonth}-${this.endmonth}.xlsx`);

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

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
}
