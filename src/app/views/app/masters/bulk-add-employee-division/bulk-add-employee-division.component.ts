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
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-bulk-add-employee-division',
    templateUrl: './bulk-add-employee-division.component.html',
    styleUrls: ['./bulk-add-employee-division.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkAddEmployeeDivisionComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('adddivision') adddivision: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal2') closeModal2: ElementRef;
  @ViewChild('addimportdivision') addimportdivision: NgForm;
  temp = [];
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
  ipAddress: any;
  allshift: any = [];
  ownerList: any;
  permissioncreate: any = [];

  permissionview: any = [];

  events: any;
  excelevents: any;
  filter: any;
  limit = 10;

  company_id: any;
  allcomp: any;
  adminRoot = environment.adminRoot;
  AllShifts: any = '';


  company: any;

  selectedcompany: any;

  allbranch: any;

  allEmployeeLeavePolicy: any;
  finalbranch: string;
  empleavedata: any;
  editDataLeaveID: number;
  leavedata: any;
  hide: boolean;
  showallowMaxInMonth: string;
  showallowMinInMonth: string;
  showallowFutureApplyDays: string;
  showallowPastApplyDays: string;
  showallowHalfDays: string;
  allDivision: any;
  companyID: any;
  showdemoExcel: boolean;
  file: any;
  format: string;
  url: string | ArrayBuffer;
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
  alldepartment: any;
  alldesignation: any;
  allWorkingArea: any;
  allDataDivision: any;
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
    if (this.company_id) {
      this.companyID = this.company_id;
      this.showdemoExcel = true;
    }
    this.getDivisionData();
    this.getIPAddress();
    this.checkpermission();
    this.getcompany();

  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('comp');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
          this.company = res.data;
          this.spinner.stop('comp');
        }
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
    this.allDataDivision = null;
    this.applicableData = '';
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
              permissionval.formName == 'AddBulkEmployeeDivision' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AddBulkEmployeeDivision' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getDivisionData(): void {
    let string = `?page=${this.body.page}&limit=${this.body.limit}`;
    if (this.body.companyId) string += `&companyMasterID=${this.body.companyId}`;

    if (this.body.search) string += `&search=${this.body.search}`;

    this.spinner.start('getData');
    this.api
      .callApi(this.constant.GETEMPLOYEEDIVISIONDATA + string, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('getData');
      });
  }

  updateFilter(event): void {
    const val = event.target.value.toLowerCase().trim();
    this.body.search = val;
    this.getDivisionData();
  }
  onChange(event: PageChangedEvent) {
    this.body.page = event.page;
    this.getDivisionData();
  }

  onLimitChange(ev: any) {
    this.body.limit = ev;
    this.limit = this.body.limit;
    this.getDivisionData();
  }

  onSubmit() {
    if (!this.adddivision.valid) {
      return;
    }
    const body = {
      userMasterID: this.adddivision.value.user,
      divisionId: this.adddivision.value.divisionId1,
      startDate: this.adddivision.value.startDate,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start('add');
    this.api
      .callApi(this.constant.BULKADDEMPLOYEEDIVISION, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.getDivisionData();
            this.company_id = +localStorage.getItem('company_id');
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.spinner.stop('add');
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

    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selectedUser = [];
    this.selecteddesig = [];
    this.selectedDivision = [];
    this.selectedWorkingArea = [];
    this.selectedgender = null;
    this.allDataDivision = null;
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
        // this.allDataDivision = res.data;
        this.selectAllForDropdownItems(this.allDivision);

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('Division');
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
    this.users_Body.branchMasterID = this.adddivision.value.branch;
    this.getUsers();
  }

  selectdepartment() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.departmentID = this.adddivision.value.department;
    this.getUsers();
  }

  selectdesig() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.designationID = this.adddivision.value.designation;
    this.getUsers();
  }

  selectdivision() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.divisionId = this.adddivision.value.division;
    this.getUsers();
  }

  selectWorkingArea() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.workingAreaId = this.adddivision.value.workingArea;
    this.getUsers();
  }
  selectgender() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.gender = this.adddivision.value.gender;
    this.getUsers();
  }
  onSelectFiles(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);

    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  addEmployeeDivision() {
    if (!this.addimportdivision.valid) {
      return;
    }

    const formData = new FormData();

    formData.append('file', this.file);
    formData.append('companyMasterID', this.companyID);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIP', this.ipAddress);

    this.spinner.start('add');
    this.api
      .callApi(this.constant.UPLOADEMPLOYEEDIVISIONEXCEL, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.closeModal2.nativeElement.click();
            this.addimportdivision.resetForm();
            this.showdemoExcel = false;
            setTimeout(() => {
              this.ngOnInit();
            }, 100);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            }),
              this.addimportdivision.resetForm();
            this.showdemoExcel = false;
            this.spinner.stop();
          }

          this.spinner.stop('add');
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.addimportdivision.resetForm();
          this.showdemoExcel = false;
          this.spinner.stop('add');
        },
      );
  }

  showdemo(id) {
    if (id) {
      this.companyID = id;
      this.showdemoExcel = true;
    } else {
      this.companyID = '';
      this.showdemoExcel = false;
    }
  }

  downloadDemo() {
    this.spinner.start('a');

    const queryString = `?companyMasterID=${this.companyID}`;

    this.api
      .callApi(
        this.constant.DEMOEXCELOFEMPLOYEEDIVISION + queryString,
        {},
        'GET',
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
            saveAs(blob, 'Employee Division.xlsx');

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
}
