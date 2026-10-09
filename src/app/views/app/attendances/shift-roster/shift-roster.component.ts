import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as xlsx from 'xlsx';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
@Component({
    selector: 'app-shift-roster',
    templateUrl: './shift-roster.component.html',
    styleUrls: ['./shift-roster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShiftRosterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('tableForm') tableForm: NgForm;
  scrollBarHorizontal = window.innerWidth < 1201;
  permissioncreate: any = [];
  permissionview: any = [];

  company_id: any;
  company1: any;

  rows = [];

  allbranch: any;
  alldepartment: any;
  alldesignation: any;
  alluser: any;
  allDivision: any;
  allWorkingArea: any;
  allshift: any;
  allRepoteeUser: any;

  selectedBranch: any = [];
  selectedDepartment: any = [];
  selecteddesig: any = [];
  selectedDivision: any = [];
  selectedWorkingArea: any = [];
  selectedUser: any = [];
  selectedRepoteeUser: any = [];

  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
    repoteeUserMasterID: [],
  };

  filterData = {
    // page: 1,
    // limit: 10,
    userMasterID: [],
    companyMasterID: '',
    fromDate: '',
    toDate: '',
    exportData: false
  };
  isResetForm: boolean = false;
  values: any = [];
  dateWiseShift = {
    userMasterID: '',
    userData: '',
    date: '',
    shiftID: ''
  };
  dateRange: any = []
  filteredUsers: any = []
  rosterUserIDs: any = []
  adminRoot = environment.adminRoot;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
      departmentID: [],
      designationID: [],
      divisionId: [],
      workingAreaId: [],
      repoteeUserMasterID: [],
    };
    this.selectcompany(this.company_id);
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
              permissionval.formName == 'ShiftRoster' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ShiftRoster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }
  private handleSuccess(message: any) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.startLoader('master3');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stopLoader('master3');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stopLoader('master3');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stopLoader('master3');
      },
    );
  }

  selectcompany(id: any) {
    this.rows = []
    this.dateRange = [];
    this.alluser = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = [];
    this.allDivision = [];
    this.allWorkingArea = [];
    this.allshift = [];
    this.allRepoteeUser = [];

    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
    this.selectedRepoteeUser = [];

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: null,
      departmentID: null,
      designationID: null,
      divisionId: null,
      workingAreaId: null,
      repoteeUserMasterID: null,
    };

    if (!id) return;
    this.isResetForm = false;

    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.alldepartment = res.data;
        this.selectAllForDropdownItems(this.alldepartment);
        this.spinner.stopLoader('master3');
      });

    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stopLoader('master3');
      });

    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.selectAllForDropdownItems(this.alldesignation);

          // this.page.totalCount = res.totalcount;
          this.spinner.stopLoader('master3');
        }
      });

    this.spinner.startLoader('master3');
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

        this.spinner.stopLoader('master3');
      });

    this.spinner.startLoader('master3');
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
        this.spinner.stopLoader('master3');
      });

    this.users_Body.companyMasterID = id;
    this.getUsers();
    this.getRepoteeUsers()
  }

  selectbranch() {
    this.rows = []
    this.alluser = [];
    this.dateRange = [];
    this.selectedUser = [];
    this.allRepoteeUser = [];
    this.selectedRepoteeUser = [];
    this.users_Body.branchMasterID = this.datefilter.value.branch;
    this.users_Body.repoteeUserMasterID = this.datefilter.value.repoteeUserMasterID;
    this.getUsers();
    this.getRepoteeUsers();
  }

  selectdepartment() {
    this.rows = []
    this.alluser = [];
    this.dateRange = [];
    this.selectedUser = []
    this.allRepoteeUser = [];
    this.selectedRepoteeUser = [];
    this.users_Body.departmentID = this.datefilter.value.department;
    this.users_Body.repoteeUserMasterID = this.datefilter.value.repoteeUserMasterID;
    this.getUsers();
    this.getRepoteeUsers();
  }

  selectdesig() {
    this.rows = []
    this.alluser = [];
    this.dateRange = [];
    this.selectedUser = [];
    this.allRepoteeUser = [];
    this.selectedRepoteeUser = [];
    this.users_Body.designationID = this.datefilter.value.designation;
    this.users_Body.repoteeUserMasterID = this.datefilter.value.repoteeUserMasterID;
    this.getUsers();
    this.getRepoteeUsers();
  }

  selectdivision() {
    this.rows = []
    this.alluser = [];
    this.dateRange = [];
    this.selectedUser = [];
    this.allRepoteeUser = [];
    this.selectedRepoteeUser = [];
    this.users_Body.divisionId = this.datefilter.value.division;
    this.users_Body.repoteeUserMasterID = this.datefilter.value.repoteeUserMasterID;
    this.getUsers();
    this.getRepoteeUsers();
  }

  selectWorkingArea() {
    this.rows = []
    this.alluser = [];
    this.allRepoteeUser = [];
    this.dateRange = [];
    this.selectedUser = [];
    this.allRepoteeUser = [];
    this.selectedRepoteeUser = [];
    this.users_Body.workingAreaId = this.datefilter.value.workingArea;
    this.users_Body.repoteeUserMasterID = this.datefilter.value.repoteeUserMasterID;
    this.getUsers();
    this.getRepoteeUsers();
  }
  selectRepotee() {
    this.rows = []
    this.alluser = [];
    this.dateRange = [];
    this.selectedUser = [];
    this.users_Body.repoteeUserMasterID = this.datefilter.value.repoteeUserMasterID;
    this.getUsers();
  }
  selectUser() {
    this.rows = []
    this.dateRange = [];
    this.filteredUsers = [];
    this.filterData.userMasterID = this.datefilter.value.user;
  }
  selectFromDate() {
    this.rows = []
    this.dateRange = [];
    this.filteredUsers = [];
    this.filterData.fromDate = this.datefilter.value.fromDate;
    this.filterData.toDate = '';
  }

  selectTodate() {
    this.rows = []
    this.dateRange = [];
    this.filteredUsers = [];
    this.filterData.toDate = this.datefilter.value.toDate;
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
    this.users_Body.repoteeUserMasterID =
      this.users_Body.repoteeUserMasterID && this.users_Body.repoteeUserMasterID.length > 0
        ? this.users_Body.repoteeUserMasterID
        : null;
    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.spinner.stopLoader('master3');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stopLoader('master3');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master3');
        },
      );
  }
  getRepoteeUsers() {
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
    this.users_Body.repoteeUserMasterID =
      this.users_Body.repoteeUserMasterID && this.users_Body.repoteeUserMasterID.length > 0
        ? this.users_Body.repoteeUserMasterID
        : null;
    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allRepoteeUser = res.data;
            this.selectAllForDropdownItems(this.allRepoteeUser);
            this.spinner.stopLoader('master3');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stopLoader('master3');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master3');
        },
      );
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
    this.isResetForm = true;
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        userMasterID: [],
        companyMasterID: localStorage.getItem('company_id'),
        fromDate: '',
        toDate: '',
        exportData: false
      };
      this.selectedUser = [];
      this.company_id = +localStorage.getItem('company_id');
      this.dateRange = [];
      this.rows = []

      this.ngOnInit();
    }, 200);

    this.isResetForm = false;
  }

  onSubmit() {
    this.rows = [];
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.company
    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.ADDSHIFTROSTER, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data
            this.allshift = res.allshift;
            this.dateRange = res.datesArray
            this.rosterUserIDs = res.rosterUserIDs
            this.handleSuccess(res.message);
            this.spinner.stopLoader('master3');

          } else {
            this.handleError(res.message);
            this.spinner.stopLoader('master3');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master3');
        },
      );
  }

  saveData() {
    this.spinner.start('saveData');
    const body = {
      updateRosterData: this.rows,
      rosterUserIDs: this.rosterUserIDs,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
    };
    this.api
      .callApi(this.constant.UPDATESHIFTROSTER, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            setTimeout(() => {
              this.rows = [];
              this.filterData = {
                userMasterID: [],
                companyMasterID: localStorage.getItem('company_id'),
                fromDate: '',
                toDate: '',
                exportData: false
              };
              this.selectedUser = [];
              this.company_id = +localStorage.getItem('company_id');
              this.dateRange = [];
              this.rows = []
              this.ngOnInit();
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.company
    this.filterData.exportData = true
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLSHIFTROSTER, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
    this.filterData.exportData = false
  }
  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Shift Roster.xlsx');
    this.spinner.stop('start');
  }

  importExcel() {
    this.router.navigate([this.adminRoot + '/attendances/shiftRoster/import_shiftRoster']);
  }
}
