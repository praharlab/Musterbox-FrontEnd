import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { environment } from 'src/environments/environment';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-bulk-add-employee-food-allowance-policy',
    templateUrl: './bulk-add-employee-food-allowance-policy.component.html',
    styleUrls: ['./bulk-add-employee-food-allowance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkAddEmployeeFoodAllowancePolicyComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('AddFoodAllowancePolicy') AddFoodAllowancePolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;

  apiURL = environment.apiUrl;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  rows: any;
  selected: [];
  applidate = new Date().toISOString().split('T')[0];
  body = {
    page: 1,
    limit: 10,
    companyId: localStorage.getItem('company_id'),
    search: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ownerList: any;
  permissioncreate: any = [];
  permissionview: any = [];
  limit = 10;
  company_id: any;
  allcomp: any;
  adminRoot = environment.adminRoot;
  company: any;
  allbranch: any;
  finalbranch: string;
  selectedfFoodAllowancePolicy: any[];
  allFoodAllowancePolicy: any;
  user_body = {
    companyMasterID: '',
    branchMasterID: '',
  };
  // selectedBranch: string;
  selectedEmployees: any[];
  selectedCompany: any;
  selectedPolicy: string;
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
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  // selectedBranch: any[];
  alldepartment: any;
  alldesignation: any;
  allDivision: any;
  allWorkingArea: any;
  selectedDivision: any[];
  selectedBranch: any[];
  selectedgender: any;
  applicableData: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.body = {
      page: 1,
      limit: 10,
      companyId: localStorage.getItem('company_id'),
      search: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.company_id = +localStorage.getItem('company_id');
    this.getFoodAllowancePolicyData();
    this.checkpermission();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('comp');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
          this.company = res.data;
          this.spinner.stop('comp');
        } else {
          this.handleError(res.message);
          this.spinner.stop('comp');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('comp');
      },
    );
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
    this.applicableData = '';
    this.selectedfFoodAllowancePolicy = [];
    this.company_id = +localStorage.getItem('company_id');
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'BulkFoodAllowancePolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkFoodAllowancePolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getFoodAllowancePolicyData(): void {
    let string = `?page=${this.body.page}&limit=${this.body.limit}`;
    if (this.body.companyId) string += `&companyMasterID=${this.body.companyId}`;

    if (this.body.search) string += `&searchQuery=${this.body.search}`;

    this.spinner.start('getData');
    this.api
      .callApi(
        this.constant.GETEMPLOYEEFOODALLOWANCEPOLICYDATA + string,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('getData');
          } else {
            this.handleError(res.message);
            this.spinner.stop('getData');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getData');
        },
      );
  }

  updateFilter(event): void {
    const val = event.target.value.toLowerCase().trim();
    this.body.search = val;
    this.getFoodAllowancePolicyData();
  }

  onChange(event: PageChangedEvent) {
    this.body.page = event.page;
    this.getFoodAllowancePolicyData();
  }

  onLimitChange(ev: any) {
    this.body.limit = ev;
    this.limit = this.body.limit;
    this.getFoodAllowancePolicyData();
  }

  onSubmit() {
    if (!this.AddFoodAllowancePolicy.valid) {
      return;
    }
    const body = {
      userMasterID: this.AddFoodAllowancePolicy.value.user,
      foodAllowancePolicyId: this.AddFoodAllowancePolicy.value.foodAllowancePolicyId,
      startDate: this.AddFoodAllowancePolicy.value.startDate,
    };
    this.spinner.start('add');
    this.api
      .callApi(this.constant.BULKADDEMPLOYEEFOODALLOWANCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.getFoodAllowancePolicyData();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.spinner.stop('add');
          } else {
            this.handleError(res.message);
            this.spinner.stop('add');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('add');
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
    this.selectedgender = null;
    this.applicableData = '';
    this.selectedfFoodAllowancePolicy = [];
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

    this.spinner.start('leavepolicy');
    this.api
      .callApi(this.constant.GETFOODALLOWANCEPOLICYBYCOMPANYID + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allFoodAllowancePolicy = res.data;
            this.spinner.stop('leavepolicy');
          } else {
            this.handleError(res.message);
            this.spinner.stop('leavepolicy');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('leavepolicy');
        },
      );

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
    this.users_Body.branchMasterID = this.AddFoodAllowancePolicy.value.branch;
    this.getUsers();
  }

  selectdepartment() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.departmentID = this.AddFoodAllowancePolicy.value.department;
    this.getUsers();
  }

  selectdesig() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.designationID = this.AddFoodAllowancePolicy.value.designation;
    this.getUsers();
  }

  selectdivision() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.divisionId = this.AddFoodAllowancePolicy.value.division;
    this.getUsers();
  }

  selectWorkingArea() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.workingAreaId = this.AddFoodAllowancePolicy.value.workingArea;
    this.getUsers();
  }
  selectgender() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.gender = this.AddFoodAllowancePolicy.value.gender;
    this.getUsers();
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
