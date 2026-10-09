import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-bulk-add-attendancepolicy',
    templateUrl: './bulk-add-attendancepolicy.component.html',
    styleUrls: ['./bulk-add-attendancepolicy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkAddAttendancepolicyComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  temp = [];
  columns = [
    { prop: 'title', name: 'Title' },
    { prop: 'sales', name: 'Sales' },
    { prop: 'stock', name: 'Stock' },
    { prop: 'category', name: 'Category' },
    { prop: 'id', name: 'Id' },
  ];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected: any = [];
  selectAllState = '';
  itemOrder = 'Title';
  itemOptionsOrders = ['Title', 'Category', 'Status', 'Label'];
  displayOptionsCollapsed = false;
  todoItems: any;
  rows: any;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  alldata1: any;
  ipAddress: any;
  current_date = new Date().toISOString().slice(0, 10);
  alldepartment: any = [];
  ownerList: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  allcomp: any;
  finalholidaypolicy: string;
  company_id: any;
  allbranch: any;
  finalbranch: string;
  selectedattendance: any;
  applidate = new Date().toISOString().split('T')[0];
  adminRoot = environment.adminRoot;

  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
    gender: null,
  };
  isResetForm: boolean = false;
  alluser: any;
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];
  alldesignation: any;
  allWorkingArea: any;
  allDivision: any;
  allworkinglocation: any;
  selectedgender: any;
  alldepartmentPolicy: any = [];
  applicableData: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getItems();
    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
    this.company_id = +localStorage.getItem('company_id');
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;

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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkAttendancePolicy' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkAttendancePolicy' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkAttendancePolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkAttendancePolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getItems(): void {
    this.spinner.start('att');
    this.api
      .callApi(this.constant.GETALLEMPATTENDANCE, this.filterData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('att');
          } else {
            this.spinner.stop('att');
          }
        },
        (err) => {
          this.spinner.stop('att');
        },
      );
  }

  updateFilter(event): void {
    const val = event.target.value.toLowerCase().trim();
    const count = this.columns.length;
    const keys = Object.keys(this.temp[0]);
    const temp = this.temp.filter((item) => {
      for (let i = 0; i < count; i++) {
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          return true;
        }
      }
    });
    this.rows = temp;
    this.table.offset = 0;
  }
  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.ngOnInit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.ngOnInit();
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: this.addcomp.value.userMasterID,
      attendancePolicyID: this.addcomp.value.holidayPolicyID,
      startDate: this.addcomp.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEBULKATTENDANCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router
                .navigate([this.adminRoot + '/masters/bulk__attendance__policy'])
                .then(() => {
                  window.location.reload();
                  this.spinner.stop();
                });
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
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

  selectcompany(id: any) {
    this.alluser = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = [];
    this.allDivision = [];
    this.allWorkingArea = [];
    this.selectedattendance = '';
    this.alldepartmentPolicy = []
    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
    this.selectedgender = null;
    this.applicableData = '';

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: null,
      departmentID: null,
      designationID: null,
      divisionId: null,
      workingAreaId: null,
      gender: null,
    };

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

    this.spinner.start('desig');
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
      .callApi(
        this.constant.LISTWORKINGAREA + '?companyMasterID=' + id + '&status=1',
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;
        this.selectAllForDropdownItems(this.allWorkingArea);

        this.spinner.stop('workingArea');
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
        this.selectAllForDropdownItems(this.allDivision);

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('Division');
      });

    this.spinner.start('location');

    let filterData1 = {
      status: 1,
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETWORKINGLOCATION, filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allworkinglocation = res.data;

          this.spinner.stop('location');
        }
      });
    this.api
      .callApi(this.constant.ATTENDANCEBYCOMPANYDATA2 + this.company_id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartmentPolicy = res.data;
          this.spinner.stop();
        }
      });
    this.users_Body.companyMasterID = id;
    this.getUsers();
  }

  getUsers() {
    if (this.isResetForm) return;

    this.users_Body.branchMasterID =
      this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0
        ? this.users_Body.branchMasterID
        : null;
    this.users_Body.departmentID =
      this.users_Body.departmentID && this.users_Body.departmentID.length > 0
        ? this.users_Body.departmentID
        : null;
    this.users_Body.designationID =
      this.users_Body.designationID && this.users_Body.designationID.length > 0
        ? this.users_Body.designationID
        : null;
    this.users_Body.divisionId =
      this.users_Body.divisionId && this.users_Body.divisionId.length > 0
        ? this.users_Body.divisionId
        : null;
    this.users_Body.workingAreaId =
      this.users_Body.workingAreaId && this.users_Body.workingAreaId.length > 0
        ? this.users_Body.workingAreaId
        : null;
    this.users_Body.gender = this.users_Body.gender;

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          // this.showForm = true;
          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((el) => {
            el.name =
              el.displayName
          });
        }
        this.spinner.stop('users');
      });
  }

  selectbranch() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.branchMasterID = this.addcomp.value.branch;
    this.getUsers();
  }

  selectdepartment() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.departmentID = this.addcomp.value.department;
    this.getUsers();
  }

  selectdesig() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.designationID = this.addcomp.value.designation;
    this.getUsers();
  }

  selectdivision() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.divisionId = this.addcomp.value.division;
    this.getUsers();
  }

  selectWorkingArea() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.workingAreaId = this.addcomp.value.workingArea;
    this.getUsers();
  }
  selectgender() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.gender = this.addcomp.value.gender;
    this.getUsers();
  }

  resetModel() {
    this.alluser = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = [];
    this.allDivision = [];
    this.allWorkingArea = [];

    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
    this.selectedgender = null;
    this.selectedattendance = '';
    this.applicableData = '';

    this.company_id = +localStorage.getItem('company_id');
  }
}
