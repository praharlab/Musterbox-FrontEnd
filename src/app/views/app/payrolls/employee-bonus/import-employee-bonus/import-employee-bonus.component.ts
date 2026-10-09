import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { bonusType } from 'src/app/constants/commonVariables';


@Component({
    selector: 'app-import-employee-bonus',
    templateUrl: './import-employee-bonus.component.html',
    styleUrls: ['./import-employee-bonus.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportEmployeeBonusComponent implements OnInit {
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
  selectedbonusYYYYMM: any;
  userMasterIDArray: any = [];
  remarksCount: any = 0;
  bonusTypeData: any = bonusType;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) { }

  ngOnInit(): void {
    this.users_Body.companyMasterID = +localStorage.getItem('company_id');
    this.selectedCompany = +localStorage.getItem('company_id');
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.isValidated = false;
    this.isEdited = true;
    this.getcompany();
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
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  prev() {
    this.router.navigate([this.adminRoot + '/payrolls/employee_bonus']);
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
            this.commonNotificationService.handleError('Something Went Wrong!');
            this.spinner.stopLoader('master3');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stopLoader('master3');
        },
      );
  }

  downloadDemoExcel() {
    if (!this.addimportuser.value.company) {
      return this.commonNotificationService.handleWarning('Select Company');
    }
    if (!this.addimportuser.value.bonusYYYYMM) {
      return this.commonNotificationService.handleWarning('Select Bonus Month');
    }

    this.spinner.start('start');
    let mainbody: any = {
      companyMasterID: this.addimportuser.value.company,
      bonusYYYYMM: this.addimportuser.value.bonusYYYYMM.replace('-', ''),
      userMasterID: this.addimportuser.value.user.length > 0 ? this.addimportuser.value.user : this.userMasterIDArray
    };
    this.api
      .callApi(
        this.constant.GENERATEDEMOEXCELEMPLOYEEBONUS,
        mainbody,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, `Demo ${this.selectedbonusYYYYMM} Bonus.xlsx`, 'text/xlsx');
          this.spinner.stop('start');

        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  validateData() {
    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);
      formData.append('bonusYYYYMM', this.addimportuser.value.bonusYYYYMM.replace('-', ''));
      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEEMPLOYEEBONUSEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              this.rows = this.rows.map((item) => ({
                ...item,
                isDeleted: false
              }));
              this.remarksCount = this.rows.filter(
                (item: any) => item.remarks !== '' && item.remarks !== null,
              ).length;

              this.commonNotificationService.handleSuccess(res.message);
              this.isValidated = true;
              this.file = {};
              this.spinner.stop('validate');
            } else {
              this.file = {};
              this.commonNotificationService.handleError(res.message);
              this.spinner.stop('validate');
            }
            this.fileName = ''
          },
          (err) => {
            this.file = {};
            this.fileName = ''
            this.commonNotificationService.handleError(err.error.message);
            this.spinner.stop('validate');
          },
        );
    }
  }

  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }
    const negativeAmountIndexes = this.rows.reduce((acc, e, index) => {
      if (e.amount < 0) acc.push(index + 1);
      return acc;
    }, []);
    if (negativeAmountIndexes.length) {
      return this.commonNotificationService.handleWarning(`Bonus Amount Can Not Negative on Sr. No ${negativeAmountIndexes.join(', ')}`);
    }
    this.spinner.start('revalidate');
    let body = {
      employeeBonusData: this.rows,
      companyMasterID: this.addimportuser.value.company,
    };
    this.api
      .callApi(this.constant.REVALIDATEEMPLOYEEBONUSDATA, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.rows = this.rows.map((item) => ({
              ...item,
              isDeleted: false
            }));
            this.remarksCount = this.rows.filter(
              (item: any) => item.remarks !== '' && item.remarks !== null,
            ).length;
            if (this.remarksCount > 0) {
              this.isEdited = true;
            } else {
              this.isEdited = false;
            }
            this.commonNotificationService.handleSuccess(res.message)
            this.spinner.stop('revalidate');
          } else {
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('revalidate');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('revalidate');
        },
      );
  }

  saveData() {
    if (!this.tableForm.valid) {
      return;
    }

    const negativeAmountIndexes = this.rows.reduce((acc, e, index) => {
      if (e.amount < 0) acc.push(index + 1);
      return acc;
    }, []);
    if (negativeAmountIndexes.length) {
      return this.commonNotificationService.handleWarning(`Bonus Amount Can Not Negative on Sr. No ${negativeAmountIndexes.join(', ')}`);
    }

    this.spinner.start('saveData');
    let body = {
      reValidatedEmployeeBonusData: this.rows,
      bonusType: this.addimportuser.value.bonusType
    };
    this.api
      .callApi(this.constant.ADDVALIDATEEMPLOYEEBONUS, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
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
            this.commonNotificationService.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.fileName = '';
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }

  onAmountChange(data, i) {
    this.isEdited = true
    if (data.amount < 0) {
      return this.commonNotificationService.handleWarning(`Bonus Amount Can Not Negative on Sr. No ${i + 1}`);
    } else {
      this.rows[i].amount = data.amount
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
    this.isEdited = true;
    this.rows[index].isDeleted = true
    this.rows = this.rows.filter((row) => row.isDeleted == false)
  }
}
