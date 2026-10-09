import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';
@Component({
    selector: 'app-bulk-initial-leave-opeing-balance',
    templateUrl: './bulk-initial-leave-opeing-balance.component.html',
    styleUrls: ['./bulk-initial-leave-opeing-balance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BulkInitialLeaveOpeingBalanceComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('tableForm') tableForm: NgForm;
  adminRoot = environment.adminRoot;
  filterData = {
    companyMasterID: +localStorage.getItem('company_id'),
  };
  isEdited: any = true;
  isValidated: any = false;
  companyData: any;
  ipAddress: any;
  rows = [];
  file: any;
  fileName: any = '';
  leaveHeader = [];

  alldepartment: any;
  alldesignation: any;
  allbranch: any;
  allWorkingArea: any;
  allDivision: any;
  users_Body = {
    companyMasterID: null,
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
  selectedCompany: any;
  userMasterIDArray: any = [];
  remarksCount: any = 0;

  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private router: Router,) { }

  ngOnInit(): void {
    this.users_Body.companyMasterID = +localStorage.getItem('company_id');
    this.selectedCompany = +localStorage.getItem('company_id');
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.isValidated = false;
    this.isEdited = true;
    this.getcompany();
    this.getIPAddress();

  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getcompany() {
    const body = {
      companyMasterID: this.filterData.companyMasterID,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          this.selectcompany(this.selectedCompany);
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
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
  prev() {
    this.router.navigate([this.adminRoot + '/masters/employee']);
  }
  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.rows = [];
    this.isValidated = false;
    event.target.value = '';
  }
  companyChange(event) {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
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
    this.selectedShift = null;
    this.selectedgender = null;
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: null,
      departmentID: null,
      designationID: null,
      divisionId: null,
      workingAreaId: null,
      gender: null,
    };
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
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
  }

  selectbranch() {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.branchMasterID = this.addimportuser.value.branch;
    this.getUsers();
  }

  selectdepartment() {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.departmentID = this.addimportuser.value.department;
    this.getUsers();
  }

  selectdesig() {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.designationID = this.addimportuser.value.designation;
    this.getUsers();
  }

  selectdivision() {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.divisionId = this.addimportuser.value.division;
    this.getUsers();
  }

  selectWorkingArea() {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.workingAreaId = this.addimportuser.value.workingArea;
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
            this.userMasterIDArray = this.alluser.map((el) => el.userMasterID);
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

  downloadDemoExcel() {
    this.spinner.start('start');
    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: this.addimportuser.value.company,
      userMasterID: this.addimportuser.value.user.length > 0 ? this.addimportuser.value.user : this.userMasterIDArray
    };
    this.api
      .callApi(
        this.constant.EXPORTLEAVEOPENINGBALANCE,
        mainbody,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }
  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Initial Leave Balance.xlsx');
    this.spinner.stop('start');
  }

  validateData() {
    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);
      // formData.append('userMasterID', this.addimportuser.value.user.length > 0 ? this.addimportuser.value.user : this.userMasterIDArray);

      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATELEAVEOPENINGBALANCE, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              for (let item of this.rows) {
                if (item.leaveRecord.length) {
                  this.leaveHeader = item.leaveRecord;
                  break;
                }
              }
              // this.leaveHeader = this.rows[0].leaveRecord
              this.remarksCount = this.rows.filter(
                (item: any) => item.remarks !== '' && item.remarks !== null,
              ).length;

              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.isValidated = true;
              this.file = {};
              this.spinner.stop('validate');
            } else {
              this.file = {};
              this.handleError(res.message);
              this.spinner.stop('validate');
            }
            this.fileName = ''
          },
          (err) => {
            this.file = {};
            this.fileName = ''
            this.handleError(err.error.message);
            this.spinner.stop('validate');
          },
        );
    }
  }

  saveData() {
    if (!this.tableForm.valid) {
      return;
    }

    const negativeLeaveBalances = this.rows
      .map(row => row.leaveRecord.filter(leave => leave.leavebal !== null && leave.leavebal < 0))
      .reduce((acc, curr) => acc.concat(curr), []); // Flatten the array
    if (negativeLeaveBalances && negativeLeaveBalances.length > 0) {
      return this.notifications.create(
        'Error',
        'Leave Balance Can Not Negative',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
    }
    this.spinner.start('saveData');
    // const userDetalis = this.rows.map((item) => ({
    //   userMasterID: item.userMasterID,
    // }));

    let body = {
      leaveOpeningBalanceData: this.rows,
    };
    this.api
      .callApi(this.constant.ADDLEAVEOPENINGBALANCE, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.rows = [];
            this.fileName = '';
            this.file = {};
            this.isValidated = false;
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.fileName = '';
            this.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.fileName = '';
          this.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }

  onLeaveOpeningBalnceChange(type, data, i, j) {
    if (type == 'YearMM') {
      this.rows[i].leaveRecord[j].YearMM = data.YearMM
    }
    if (type == 'leavebal') {
      if (data.leavebal < 0) {
        return this.notifications.create(
          'Error',
          'Leave Balance Can Not Negative',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          },
        );
      } else {
        this.rows[i].leaveRecord[j].leavebal = data.leavebal
      }
    }
  }
  clear() {
    this.rows = [];
    this.remarksCount = 0;
    this.fileName = '';
    this.file = {};
    this.spinner.start('company');
    setTimeout(() => {
      this.ngOnInit();
      this.spinner.stop('company');
    }, 3000);
    this.isValidated = false;
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);

    this.remarksCount = this.rows.filter(
      (item: any) => item.remarks !== '' && item.remarks !== null,
    ).length;

  }
}
