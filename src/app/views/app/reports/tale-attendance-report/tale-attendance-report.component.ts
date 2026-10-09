import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-tale-attendance-report',
    templateUrl: './tale-attendance-report.component.html',
    styleUrls: ['./tale-attendance-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TaleAttendanceReportComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];

  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  ColumnMode = ColumnMode;

  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 10,
    month: '',
    userMasterID: [],
    companyMasterID: '',
    Export: ''
  };


  company_id: any;

  company: any;
  permissionview: any = [];

  alluser: any;
  allbranch: any;

  export: any;
  currentPage: number;
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
  isResetForm:boolean = false;


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
    this.limit = 10
    this.filterData = {
      page: 1,
      limit: 10,
      month: '',
      userMasterID: [],
      companyMasterID: '',
      Export: ''
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

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

  getData() {

    this.filterData.Export = ''

    this.spinner.start('start')

    this.api
      .callApi(this.constant.GETTALEATTREPORT, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('start');
          }

        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('start');
        },
      );

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
              permissionval.formName == 'TallyFormateAttendanceReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getUsers() {
    if(this.isResetForm) return;
  
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
      this.isResetForm = false;
      
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

  // selectcompany(id) {
  //   if (!id) return this.datefilter.resetForm();
  //   this.spinner.start();
  //   this.api
  //     .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //     .subscribe((res: any) => {

  //       this.allbranch = res;

  //     });

  //   const body = {
  //     page: '',
  //     limit: '',
  //     companyMasterID: id,
  //   };
  //   this.api
  //     .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.alluser = res.data;
  //         this.selectAllForDropdownItems(this.alluser);
  //         this.spinner.stop();
  //       }
  //     });
  // }

  // selectbranch(id) {

  //   const filterData = {
  //     branchMasterID: id,
  //   };
  //   if (id) {
  //     this.spinner.start();
  //     this.api
  //       .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.alluser = res.data;
  //           this.selectAllForDropdownItems(this.alluser);
  //           this.alluser.map((el) => {
  //             el.name = el.displayName;
  //           });

  //           this.spinner.stop();
  //         }
  //       });
  //   } else {
  //     const body = {
  //       page: '',
  //       limit: '',
  //       companyMasterID: this.datefilter.value.cid,
  //     };
  //     this.spinner.start();
  //     this.api
  //       .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
  //       .subscribe((res: any) => {
  //         if (res.status == 200) {
  //           this.alluser = res.data;
  //           this.selectAllForDropdownItems(this.alluser);
  //           this.spinner.stop();
  //         }
  //       });
  //   }
  // }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.page = 1
    this.filterData.companyMasterID = this.datefilter.value.cid;
    this.filterData.userMasterID = this.datefilter.value.user;
    this.filterData.month = this.datefilter.value.YearMM.replace('-', '');

    this.getData();

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

    this.filterData.Export = 'true'

    this.spinner.start('a');

    this.api
      .callApi(
        this.constant.GETTALEATTREPORT,
        this.filterData,
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
            saveAs(blob, `Tally Format Attendance Report - ${this.filterData.month}.xlsx`);

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
    this.isResetForm = true;
    this.datefilter.resetForm();
    setTimeout(() => {
      this.rows = [];
      this.ngOnInit();
    }, 200);
    this.isResetForm = false;
  }
}
