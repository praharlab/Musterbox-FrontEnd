import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { environment } from 'src/environments/environment';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-bulk-add-working-location',
    templateUrl: './bulk-add-working-location.component.html',
    styleUrls: ['./bulk-add-working-location.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkAddWorkingLocationComponent implements OnInit {
  maxSize = 5;
  bigTotalItems = 175;
  bigCurrentPage = 1;
  // @ViewChild(DatatableComponent) table: DatatableComponent
  @ViewChild('addworkinglocation') addworkinglocation: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;

  temp = [];
  apiURL = environment.apiUrl;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  rows: any;
  selected: [];
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    searchQuery: '',
  };
  body = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  allshift: any = [];
  ownerList: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  events: any;
  excelevents: any;
  filter: any;
  limit = 10;
  usertype: any;
  company_id: any;
  allcomp: any;
  applidate = new Date().toISOString().split('T')[0];
  adminRoot = environment.adminRoot;
  AllShifts: any = '';

  shiftdata: any = [];
  company: any;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  starttime: any;
  totalhours: any;
  totalhourshalfday: any;
  endtime: any;
  secondhalfstarttime: any;
  firsthalfstarttime: any;
  deduction: any;

  showearlyby: any;
  show: any;
  by_Branch: boolean = false;
  predefined1: any = '0';
  selectedEarlyPenalty: any = '0';
  reference_ID: any;
  values: any = [];

  EarlyGovalues: any = [];
  allowearlybypenalty: boolean = false;
  selectedEarlyGoPenalty: any = 'slotminute';
  EarlyGodeduction: any;
  allbranch: any;
  alldepartment: any;
  finalbranch: string;
  selectedattendance: string;
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
    gender: null
  }
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
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id');
    this.getworkinglocationbyuser();
    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
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
          this.allcomp = res.data;
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkWorkingLocation' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkWorkingLocation' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkWorkingLocation' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkWorkingLocation' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getworkinglocationbyuser(): void {
    this.spinner.start('getData');
    this.api
      .callApi(this.constant.GETEMPLOYEEWORKINGLOCATION, this.filterData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.filter = 'main';
            this.temp = [...this.rows];
            this.spinner.stop('getData');
            this.page.totalCount = res.totalcount;
          } else {
            this.spinner.stop('getData');
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          }
        },
        (err) => {
          this.spinner.stop('getData');
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }

  updateFilter(event: any): void {
    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.events = val;
      this.filterData.searchQuery = val;
    } else {
      this.filterData.searchQuery = this.events;
    }

    // this.api
    //   .callApi(this.constant.GETEMPLOYEEWORKINGLOCATION, this.filterData, 'POST', true, false, true)
    //   .subscribe((res: any) => {
    //     if (res.status == 200) {
    //       this.filter = 'search';
    //       this.rows = res.data;
    //       this.temp = [...this.rows];
    //       this.page.totalCount = res.totalcount;
    //       this.spinner.stop();
    //     }
    //   });
  }
  onChange(event: PageChangedEvent) {
    this.filterData.page = event.page;

    if (this.filter == 'main') {
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    }
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    if (this.filter == 'main') {
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    }
  }

  onSubmit() {
    if (!this.addworkinglocation.valid) {
      return;
    }
    let body = {
      userMasterID: this.addworkinglocation.value.user,
      workingLocationIDs: this.addworkinglocation.value.holidayPolicyID,
      startDate: this.addworkinglocation.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.ADDBULKEMPLOYEEWORKINGLOCATION, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router
                .navigate([this.adminRoot + '/masters/bulk_addworkingLocation'])
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

  resetModel() {
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
    this.selectedgender = null;
    this.applicableData = '';
    this.company_id = +localStorage.getItem('company_id');

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
    this.alldesignation = []
    this.allDivision = []
    this.allWorkingArea = []
    this.selectedattendance = '';

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
      gender: null
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


    this.users_Body.companyMasterID = id;
    this.getUsers();
  }

  getUsers() {
    if (this.isResetForm) return;

    this.users_Body.branchMasterID = this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0 ? this.users_Body.branchMasterID : null
    this.users_Body.departmentID = this.users_Body.departmentID && this.users_Body.departmentID.length > 0 ? this.users_Body.departmentID : null
    this.users_Body.designationID = this.users_Body.designationID && this.users_Body.designationID.length > 0 ? this.users_Body.designationID : null
    this.users_Body.divisionId = this.users_Body.divisionId && this.users_Body.divisionId.length > 0 ? this.users_Body.divisionId : null
    this.users_Body.workingAreaId = this.users_Body.workingAreaId && this.users_Body.workingAreaId.length > 0 ? this.users_Body.workingAreaId : null
    this.users_Body.gender = this.users_Body.gender

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
    this.users_Body.branchMasterID = this.addworkinglocation.value.branch;
    this.getUsers();
  }

  selectdepartment() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.departmentID = this.addworkinglocation.value.department;
    this.getUsers();
  }


  selectdesig() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.designationID = this.addworkinglocation.value.designation;
    this.getUsers();
  }


  selectdivision() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.divisionId = this.addworkinglocation.value.division;
    this.getUsers();
  }

  selectWorkingArea() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.workingAreaId = this.addworkinglocation.value.workingArea;
    this.getUsers();
  }
  selectgender() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.gender = this.addworkinglocation.value.gender;
    this.getUsers();
  }
}
