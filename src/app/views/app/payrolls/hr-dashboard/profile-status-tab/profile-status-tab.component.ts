import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { Router, NavigationStart } from '@angular/router';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-profile-status-tab',
    templateUrl: './profile-status-tab.component.html',
    styleUrls: ['./profile-status-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProfileStatusTabComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    users: [],
    companyMasterID: '',
    exportData: '',
    userMasterID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number;
  limit = 10;
  company_id: any;
  alluser: any;
  company1: any;
  allbranch: any;

  allWorkingArea: any;
  alldesignation: any;
  alldepartment: any;
  allDivision: any;

  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
  };
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];
  isResetForm: boolean = false;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/dashboards/analytics',
          this.adminRoot + '/masters/edit_employee',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeMasterComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
      departmentID: [],
      designationID: [],
      divisionId: [],
      workingAreaId: [],
    };
    this.selectcompany(this.company_id);

    (this.filterData.userMasterID = localStorage.getItem('id')),
      (this.filterData.companyMasterID = this.company_id);
    this.getProfilePercentageData();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.startLoader('master1');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stopLoader('master1');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stopLoader('master1');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stopLoader('master1');
      },
    );
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

    this.spinner.startLoader('master1');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.spinner.stopLoader('master1');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stopLoader('master1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master1');
        },
      );
  }

  selectcompany(id: any) {
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

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: null,
      departmentID: null,
      designationID: null,
      divisionId: null,
      workingAreaId: null,
    };

    if (!id) return;
    this.company_id = id
    this.isResetForm = false;

    this.spinner.startLoader('master1');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.alldepartment = res.data;
        this.selectAllForDropdownItems(this.alldepartment);
        this.spinner.stopLoader('master1');
      });

    this.spinner.startLoader('master1');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stopLoader('master1');
      });

    this.spinner.startLoader('master1');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.selectAllForDropdownItems(this.alldesignation);

          // this.page.totalCount = res.totalcount;
          this.spinner.stopLoader('master1');
        }
      });

    this.spinner.startLoader('master1');
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

        this.spinner.stopLoader('master1');
      });

    this.spinner.startLoader('master1');
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
        this.spinner.stopLoader('master1');
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

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.page = 1;
    this.filterData.users = this.datefilter.value.user;
    this.filterData.companyMasterID = this.company_id;
    this.getProfilePercentageData();
  }

  getProfilePercentageData() {
    this.spinner.startLoader('master1');

    this.api
      .callApi(this.constant.GETPROFILEPERCENTAGE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stopLoader('master1');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stopLoader('master1');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master1');
        },
      );
  }

  downloadExcel() {
    this.spinner.startLoader('master1');

    this.filterData.exportData = 'true';
    this.api
      .callApi(this.constant.GETPROFILEPERCENTAGE, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master1');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Employee Profile Percentaget.xlsx');
    this.spinner.stopLoader('master1');
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getProfilePercentageData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getProfilePercentageData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.isResetForm = true;
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        users: [],
        companyMasterID: '',
        exportData: '',
        userMasterID: '',
      };
      this.selectedUser = [];
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.company_id = +localStorage.getItem('company_id');
      this.ngOnInit();
    }, 200);

    this.isResetForm = false;
  }

  navigateEmpMaster(rowData: any) {
    this.formValueStorageService.navigate(
      'ListEmployeeMasterComponent',
      '',
      '/masters/edit_employee',
      rowData.userMasterID,
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
