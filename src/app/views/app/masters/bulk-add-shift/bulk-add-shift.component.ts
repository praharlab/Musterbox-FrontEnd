import { HttpClient } from '@angular/common/http';
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
    selector: 'app-bulk-add-shift',
    templateUrl: './bulk-add-shift.component.html',
    styleUrls: ['./bulk-add-shift.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkAddShiftComponent implements OnInit {
  maxSize = 5;
  bigTotalItems = 175;
  bigCurrentPage = 1;
  // @ViewChild(DatatableComponent) table: DatatableComponent
  @ViewChild('addshift') addshift: NgForm;
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
  };
  body = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
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
  childcompany: string;
  usertype: any;
  company_id: any;
  allcomp: any;
  applidate = new Date().toISOString().split('T')[0];
  adminRoot = environment.adminRoot;
  AllShifts: any = '';

  shiftdata: any;
  company: any;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  starttime: any;
  totalhours: any;
  totalhourshalfday: any;
  endtime: any;
  secondhalfstarttime: any;
  firsthalfstarttime: any;
  deduction: any;
  Mondaystarttime: any;
  Mondayfirsthalfend: any;
  Mondaysecondhalfstart: any;
  Mondayendtime: any;
  Mondaytotalhours: any;
  Mondaytotalhourshalfday: any;

  Tuesdaystarttime: any;
  Tuesdayfirsthalfend: any;
  Tuesdaysecondhalfstart: any;
  Tuesdayendtime: any;
  Tuesdaytotalhours: any;
  Tuesdaytotalhourshalfday: any;

  Wednesdaystarttime: any;
  Wednesdayfirsthalfend: any;
  Wednesdaysecondhalfstart: any;
  Wednesdayendtime: any;
  Wednesdaytotalhours: any;
  Wednesdaytotalhourshalfday: any;

  Thursdaystarttime: any;
  Thursdayfirsthalfend: any;
  Thursdaysecondhalfstart: any;
  Thursdayendtime: any;
  Thursdaytotalhours: any;
  Thursdaytotalhourshalfday: any;

  Fridaystarttime: any;
  Fridayfirsthalfend: any;
  Fridaysecondhalfstart: any;
  Fridayendtime: any;
  Fridaytotalhours: any;
  Fridaytotalhourshalfday: any;

  Saturdaystarttime: any;
  Saturdayfirsthalfend: any;
  Saturdaysecondhalfstart: any;
  Saturdayendtime: any;
  Saturdaytotalhours: any;
  Saturdaytotalhourshalfday: any;

  Sundaystarttime: any;
  Sundayfirsthalfend: any;
  Sundaysecondhalfstart: any;
  Sundayendtime: any;
  Sundaytotalhours: any;
  Sundaytotalhourshalfday: any;

  sandwichleave: any;
  selectedcompany: any;
  table: any;
  alldepartment: any;
  alldesignation: any;
  allbranch: any;
  referncedata: any;
  allowpanelty: boolean = false;
  allowearlyby: boolean = false;
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

  allWorkingArea: any;
  allDivision: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: [],
    gender: null,
  };
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];
  isResetForm: boolean = false;
  alluser: any;
  company1: any;
  selectedShift: any;
  selectedgender: any;
  applicableData: any;
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
    this.childcompany = localStorage.getItem('childcompany');
    this.getShiftsByUser();
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
          // this.selectcompany(this.company_id);
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
              permissionval.formName == 'BulkShift' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkShift' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkShift' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'BulkShift' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getShiftsByUser(): void {
    this.spinner.start('getData');
    this.api
      .callApi(this.constant.GETALLEMPLOYEESHIFT, this.filterData, 'POST', true, true, true)
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

  updateFilter(event): void {
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    this.body.searchQuery = val;
    if (val == '') {
      this.limit = 10;
      this.ngOnInit();
    }
    this.api
      .callApi(this.constant.GETALLEMPLOYEESHIFT, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'search';
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  onChange(event: PageChangedEvent) {
    if (this.filter == 'main') {
      this.filterData.page = event.page;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.page = event.page;
      this.updateFilter(this.events);
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'main') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.updateFilter(this.events);
    }
  }

  onSubmit() {
    if (!this.addshift.valid) {
      return;
    }
    let body = {
      userMasterID: this.addshift.value.user,
      shiftID: null,
      shiftsID: this.addshift.value.shiftID,
      startDate: this.addshift.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEEMPLOYEESHIFTBULKV2, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/masters/bulk_add_shift']).then(() => {
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

  setShift(item: any) {
    this.AllShifts = item;
  }

  getShift(item: any) {
    this.editdata(item);
    this.getcompany();
  }

  editdata(item: any) {
    // let companyid = this.activatedRoute.snapshot.params.id
    this.spinner.start();
    this.api.callApi(this.constant.VIEWSHIFT + item, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.shiftdata = res.data;

        for (var i = 0; i < this.shiftdata.shiftTime.length; i++) {
          if (this.shiftdata.shiftTime[i].day == 'Monday') {
            this.Mondaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Mondayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Mondaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Mondayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Mondaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Mondaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Tuesday') {
            this.Tuesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Tuesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Tuesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Tuesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Tuesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Tuesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Wednesday') {
            this.Wednesdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Wednesdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Wednesdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Wednesdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Wednesdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Wednesdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Thursday') {
            this.Thursdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Thursdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Thursdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Thursdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Thursdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Thursdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Friday') {
            this.Fridaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Fridayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Fridaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Fridayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Fridaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Fridaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Saturday') {
            this.Saturdaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Saturdayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Saturdaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Saturdayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Saturdaytotalhours = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhours) * 60,
            );
            this.Saturdaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          } else if (this.shiftdata.shiftTime[i].day == 'Sunday') {
            this.Sundaystarttime = this.shiftdata.shiftTime[i].statTime;
            this.Sundayfirsthalfend = this.shiftdata.shiftTime[i].firsthalfendtime;
            this.Sundaysecondhalfstart = this.shiftdata.shiftTime[i].secondhalfstarttime;
            this.Sundayendtime = this.shiftdata.shiftTime[i].endtime;
            this.Sundaytotalhours = Math.round(Number(this.shiftdata.shiftTime[i].totalhours) * 60);
            this.Sundaytotalhourshalfday = Math.round(
              Number(this.shiftdata.shiftTime[i].totalhourshalfday) * 60,
            );
          }
        }

        if (
          !this.shiftdata.allowDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.lateComing &&
          !this.shiftdata.paneltyDeduction &&
          !this.shiftdata.paneltyDays &&
          !this.shiftdata.paneltyMin &&
          !this.shiftdata.deductionOn
        ) {
          this.allowpanelty = false;
          this.show = '0';
        } else {
          this.allowpanelty = true;
          this.show = '1';
        }
        if (
          (!this.shiftdata.goEarly || this.shiftdata.goEarly == 0) &&
          !this.shiftdata.goEarlyallowdays
        ) {
          this.allowearlyby = false;
          this.showearlyby = '0';
        } else {
          this.allowearlyby = true;
          this.showearlyby = '1';
        }

        if (this.shiftdata.referenceId == 0) {
          this.shiftdata.referenceId = null;
        }
        if (this.shiftdata.branchID == 0) {
          this.shiftdata.branchID = null;
        }

        if (
          this.shiftdata.paneltyDeduction == 'slotminute' ||
          this.shiftdata.paneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.slot.length; i++) {
            this.values.push({ slot: this.shiftdata.slot[i], value: this.shiftdata.value[i] });
          }
        }

        if (
          this.shiftdata.goEarlyPaneltyDeduction == 'slotminute' ||
          this.shiftdata.goEarlyPaneltyDeduction == 'slotamount'
        ) {
          for (var i = 0; i < this.shiftdata.goEarlyslot.length; i++) {
            this.EarlyGovalues.push({
              slot: this.shiftdata.goEarlyslot[i],
              value: this.shiftdata.goEarlyvalue[i],
            });
          }
          this.selectedEarlyPenalty = '1';
          this.allowearlybypenalty = true;
        }

        if (this.shiftdata.referenceId) {
          this.shiftdata.branchID = Number(this.shiftdata.branchID);
          this.by_Branch = true;
          this.predefined1 = '1';

          this.selectedcompany = this.shiftdata.companyMasterID;
          this.gettable(this.shiftdata.table);
          this.reference_ID = Number(this.shiftdata.referenceId);

          this.api
            .callApi(
              this.constant.BRANCHBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
              {},
              'GET',
              true,
              false,
              true,
            )
            .subscribe((res: any) => {
              this.allbranch = res;
            });
        } else {
          this.reference_ID = '';
        }
        // this.selectedcompany=this.shiftdata.companyMasterID;
        this.shiftdata.referenceId = Number(this.shiftdata.referenceId);
        //this.gettable(this.shiftdata.table)
        this.deduction = this.shiftdata.paneltyDeduction;
        this.spinner.stop();
      },
      (err) => {
        console.log('error', err);
      },
    );
  }

  gettable(event) {
    this.table = event;
    this.reference_ID = '';

    if (this.table == 'departments') {
      this.alldesignation = [];
      this.api
        .callApi(
          this.constant.DEPARTMENTBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldepartment = res.data;
          }
        });
    } else if (this.table == 'designations') {
      this.alldepartment = [];
      this.api
        .callApi(
          this.constant.DESIGNATIONBYCOMPANYDATA1 + this.shiftdata.companyMaster.companyMasterID,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alldesignation = res.data;
          }
        });
    } else {
      this.alldesignation = [];
      this.alldepartment = [];
    }
  }

  selectcompany(id: any) {
    this.alluser = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = [];
    this.allDivision = [];
    this.allWorkingArea = [];
    this.allshift = [];

    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
    this.selectedShift = null;
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

    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.SHIFTBYCOMPANYDATA2 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allshift = res.data;

          this.spinner.stopLoader('master3');
        }
      });
    this.users_Body.companyMasterID = id;
    this.getUsers();
  }

  selectbranch() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.branchMasterID = this.addshift.value.branch;
    this.getUsers();
  }

  selectdepartment() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.departmentID = this.addshift.value.department;
    this.getUsers();
  }

  selectdesig() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.designationID = this.addshift.value.designation;
    this.getUsers();
  }

  selectdivision() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.divisionId = this.addshift.value.division;
    this.getUsers();
  }

  selectWorkingArea() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.workingAreaId = this.addshift.value.workingArea;
    this.getUsers();
  }
  selectgender() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.gender = this.addshift.value.gender;
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

    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);

            this.alluser.map((el) => {
              el.name =
                el.displayName + `(${el.userNumber})`
            });
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
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
    this.applicableData = '';

    this.company_id = +localStorage.getItem('company_id');
  }
}
