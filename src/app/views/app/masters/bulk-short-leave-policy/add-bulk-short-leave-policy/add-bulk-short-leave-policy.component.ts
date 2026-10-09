import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-bulk-short-leave-policy',
    templateUrl: './add-bulk-short-leave-policy.component.html',
    styleUrls: ['./add-bulk-short-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddBulkShortLeavePolicyComponent implements OnInit {

  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;

  permissioncreate: any = [];
  permissionview: any = [];


  company_id: any;
  rows: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
    gender: null,
  };
  filterData = {
    page: 1,
    limit: 10,
    search: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  ipAddress: any;

  allcomp: any;
  applicableData: any
  alldesignation: any;
  allDivision: any;
  allWorkingArea: any;
  alluser: any;
  allbranch: any;
  alldepartment: any = [];
  alldepartmentPolicy: any = [];

  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];

  selectedgender: any;
  finalShortLeave: any;
  isResetForm: boolean = false;
  adminRoot = environment.adminRoot;

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
    this.alldata()
    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
  }

  selectcompany(id) {
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
    this.finalShortLeave = null;
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
        this.spinner.stop('Division');
      });


    let string = `?companyMasterID=${this.company_id}`;

    this.api
      .callApi(this.constant.GETSHORTLEAVEDATA + string, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartmentPolicy = res.data;
          this.spinner.stop();
        }
      });
    this.users_Body.companyMasterID = id;
    this.getUsers();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
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
          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((el) => {
            el.name =
              el.displayName
          });
        }
        this.spinner.stop('users');
      });
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
    this.finalShortLeave = null;
    this.applicableData = '';

    this.company_id = +localStorage.getItem('company_id');
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      userMasterID: this.addcomp.value.userMasterID,
      shortLeavePolicyID: +this.addcomp.value.shortLeavePolicyID,
      month: this.addcomp.value.applicableDate,
    };

    this.spinner.start('add');
    this.api.callApi(this.constant.ADDEMPSHORTLEAVEPOLICYDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.ngOnInit();
          this.lgModal.hide()
          this.addcomp.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('add');
      },
    );
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

  selectdivision() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.divisionId = this.addcomp.value.division;
    this.getUsers();
  }

  selectdesig() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.designationID = this.addcomp.value.designation;
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
              permissionval.formName == 'BulkShortLeavePolicy' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkShortLeavePolicy' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
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

  alldata() {
    const body = this.filterData
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEESHORTLEAVEPOLICYBYCOMPANY,
        body,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount
          for (let item of this.rows) {
            if (item.endDate === null && item.leavePolicyStatus === 'active') {
              break;
            }
          }
          this.spinner.stop();
        }
      });
  }

  onItemPerPageChange(val: any) {
    this.filterData.limit = val
    this.alldata()
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.search = '';
      setTimeout(() => {
        this.alldata();
      }, 100);
    } else {
      this.filterData.search = inputValue;
      this.alldata();
    }
  }

  onChange(val: PageChangedEvent) {
    this.filterData.page = val.page
    this.alldata()
  }
}