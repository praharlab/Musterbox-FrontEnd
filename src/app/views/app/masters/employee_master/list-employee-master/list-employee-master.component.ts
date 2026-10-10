import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { FilterStatusService } from 'src/app/services/filter-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { NationalityListService } from 'src/app/services/nationality-list.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { attendanceFromType } from 'src/app/constants/commonVariables';
import { labelUtils } from 'src/app/constants/labelUtils';
import { DownloadFileService } from 'src/app/services/download-file.service';
@Component({
    selector: 'app-list-employee-master',
    templateUrl: './list-employee-master.component.html',
    styleUrls: ['./list-employee-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeMasterComponent implements OnInit {
  @ViewChild('filterform') filterform: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('updateimportuser') updateimportuser: NgForm;

  rows: any = [];
  myInputVariable: ElementRef;
  file: any;
  apiURL = environment.apiUrl;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;

  filterData: any = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    departmentID: null,
    designationID: null,
    branchMasterID: null,
    divisionId: null,
    workingAreaId: null,
    repoteeUserMasterID: null,
    status: 1,
    searchQuery: '',
  };
  body = {
    company: '',
    department: '',
    designation: '',
    status: '',
    page: 1,
    limit: 10,
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  alldepartment: any = [];
  alldesignation: any;
  excel: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  filter: string;
  limit = 10;
  events: any;
  excelevents: any;
  comp: any;
  format: string;
  url: string | ArrayBuffer;
  childcompany: string;
  rows2: any = [];
  body3 = {
    company: '',
    department: '',
    designation: '',
    status: '',
    page: 1,
    limit: 10,
  };
  imgshow1: boolean;
  checkdata: any;
  companyID: string;
  showdemoexcel: boolean = false;
  comp_branch: any = [];
  comp_designation: any = [];
  comp_department: any = [];
  comp_shift: any = [];
  comp_attendance: any = [];
  comp_salary: any = [];
  comp_weekoff: any = [];
  comp_holiday: any = [];
  comp_grade: any = [];
  comp_state: any = [];
  comp_bankdata: any = [];
  employeedata: any = [];
  showdemoexcel1: boolean;
  roleFilter: { page: number; limit: number; searchQuery: string; companyMasterID: string };
  comp_roledata: any;
  comp_contractorNames: any;
  allbranch: any;
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  selectedCompany: any;
  selectedStatus: any;
  selectedWorkingArea: any;
  selectedDivision: any;
  selectedRepoteeUser: any;
  currentPage: number;
  searchvalue: any;
  allWorkingArea: any = [];
  allDivision: any = [];
  allbranchData: any;
  selectedBranch: any;

  nationalityList: any[] = [];
  nationalityListData: any[] = [];
  pfNumber: any = labelUtils.pfNumber;
  pfJoiningDate: any = labelUtils.pfJoiningDate;
  pfBank: any = labelUtils.pfBank;
  pfBankIFSCCode: any = labelUtils.pfBankIFSCCode;
  pfBankAccountNumber: any = labelUtils.pfBankAccountNumber;
  esicNumber: any = labelUtils.esicNumber;
  esicJoiningDate: any = labelUtils.esicJoiningDate;
  esicEndMonth: any = labelUtils.esicEndMonth;
  salaryCalculationAct: any = labelUtils.salaryCalculationAct;
  aadharCardNumber: any = labelUtils.aadharCardNumber;
  nameOnAadhar: any = labelUtils.nameOnAadhar;
  viewAadhar: any = labelUtils.viewAadhar;
  showBankBranch: any = labelUtils.showBankBranch;
  bankIfscCodeLabel: any = labelUtils.bankIfscCodeLabel;
  MusterBoxNameLabel: any = labelUtils.MusterBoxNameLabel;
  showUanNumber: any = labelUtils.showUanNumber;
  showpfbankAccountNo: any = labelUtils.showpfbankAccountNo;
  showPanCard: any = labelUtils.showPanCard;
  showpfbankMasterID: any = labelUtils.showpfbankMasterID;
  showpfbankIFSC: any = labelUtils.showpfbankIFSC;
  showesicEndMonth: boolean = labelUtils.showesicEndMonth;
  othernumberLabel: string = labelUtils.othernumberLabel;
  allRepoteeUser: any;
  allbranch_Update: any[] = [];
  selectedbranch_update: any;
  confirmLabel: any = labelUtils.confirmLabel;
  RetainerLabel: any = labelUtils.RetainerLabel;
  VisitingConsultantLabel: any = labelUtils.VisitingConsultantLabel;
  showPayrollFrequency = labelUtils.showPayrollFrequency;
  attendanceFromENUM = attendanceFromType;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private filterService: FilterStatusService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private profileStatusService: ProfileStatusService,
    private nationalityListService: NationalityListService,
    private commonNotificationService: CommonNotificationService,
    private downloadFileService: DownloadFileService,
  ) {}

  ngOnInit(): void {
    this.profileStatusService.clearAllProfileStatus();
    this.childcompany = localStorage.getItem('childcompany');

    if (this.filterService.filterCompany)
      this.filterData.companyMasterID = this.filterService.filterCompany;
    if (this.filterService.filterDepartment)
      this.filterData.departmentID = this.filterService.filterDepartment;
    if (this.filterService.filterDesignation)
      this.filterData.designationID = this.filterService.filterDesignation;
    if (this.filterService.filterBranch)
      this.filterData.branchMasterID = this.filterService.filterBranch;
    if (this.filterService.filterStatus == 0 || this.filterService.filterStatus == 1)
      this.filterData.status = this.filterService.filterStatus;
    if (this.filterService.filterPage) this.filterData.page = this.filterService.filterPage;
    if (this.filterService.filterLimit) this.filterData.limit = this.filterService.filterLimit;
    if (this.filterService.filterSearchQuery)
      this.filterData.searchQuery = this.filterService.filterSearchQuery;
    if (this.filterService.filterDivision)
      this.filterData.divisionId = this.filterService.filterDivision;
    if (this.filterService.filterWorkingArea)
      this.filterData.workingAreaId = +this.filterService.filterWorkingArea;
    if (this.filterService.filterRepoteeUser)
      this.filterData.repoteeUserMasterID = +this.filterService.filterRepoteeUser;
    this.filter = 'main';
    this.getcompany();
    this.checkpermission();
    this.getIPAddress();

    if (this.filterData.companyMasterID) this.selectedCompany = this.filterData.companyMasterID;
    this.SelectedCompany(this.selectedCompany);
    if (this.filterData.branchMasterID) this.selectedbranch = this.filterData.branchMasterID;
    if (this.filterData.departmentID) this.selecteddept = this.filterData.departmentID;
    if (this.filterData.designationID) this.selecteddesig = this.filterData.designationID;
    if (this.filterData.searchQuery) this.searchvalue = this.filterData.searchQuery;
    if (this.filterData.workingAreaId) this.selectedWorkingArea = this.filterData.workingAreaId;
    if (this.filterData.divisionId) this.selectedDivision = this.filterData.divisionId;
    if (this.filterData.repoteeUserMasterID)
      this.selectedRepoteeUser = this.filterData.repoteeUserMasterID;

    this.selectedStatus = this.filterData.status.toString();

    this.filterService.clearFilterData();

    this.getAllUserData();
    this.page.offset = (this.filterData.page - 1) * this.filterData.limit;
  }

  setStorage() {
    this.filterService.setFilterData(this.filterData);
  }

  navigateToEditPage(itemData: any): void {
    this.formValueStorageService.navigate(
      'ListEmployeeMasterComponent',
      this.filterData,
      '/masters/edit_employee',
      itemData.userMasterID,
    );
  }

  SelectedCompany(id: any) {
    // getDepartmenData() { }

    this.alldepartment = [];
    this.alldesignation = [];
    this.allbranch = [];
    this.allDivision = [];
    this.allWorkingArea = [];
    this.allRepoteeUser = [];

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;
    this.selectedRepoteeUser = null;

    if (!id) return;
    this.filterData.companyMasterID = id;
    this.getBranchData(id);
    this.getDepartmentData(id);
    this.getDesignationData(id);
    this.getWorkingAreaData(id);
    this.getDivisonData(id);
    this.getRepoteeUsers();
    this.getAllUserData();
  }

  getBranchData(id) {
    this.spinner.start('Branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('Branch');
      });
  }

  getDepartmentData(id) {
    this.spinner.start('Department');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          this.spinner.stop('Department');
        }
      });
  }

  getDesignationData(id) {
    this.spinner.start('Designation');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.spinner.stop('Designation');
        }
      });
  }

  getWorkingAreaData(id) {
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
        this.spinner.stop('workingArea');
      });
  }

  getDivisonData(id) {
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
        this.spinner.stop('Division');
      });
  }
  getRepoteeUsers() {
    this.selectedRepoteeUser = null;
    this.allRepoteeUser = [];
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      status: 1,
    };
    this.spinner.startLoader('master3');
    this.api.callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allRepoteeUser = res.data;
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

  getAllUserData() {
    // this.rows = []
    this.spinner.start('User');
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.rows = [];
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 200);
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('User');
      });
  }

  selectbranch() {
    this.filterData.branchMasterID = this.filterform.value.branch;
    this.getAllUserData();
  }

  selectdepartment() {
    this.filterData.departmentID = this.filterform.value.department;
    this.getAllUserData();
  }

  selectdesig() {
    this.filterData.designationID = this.filterform.value.designation;
    this.getAllUserData();
  }

  selectdivision() {
    this.filterData.divisionId = this.filterform.value.division;
    this.getAllUserData();
  }

  selectWorkingArea() {
    this.filterData.workingAreaId = this.filterform.value.workingArea;
    this.getAllUserData();
  }

  selectReportingPerson() {
    this.filterData.repoteeUserMasterID = this.filterform.value.repoteeUserMasterID;
    this.getAllUserData();
  }

  selectEmployeeStatusChange() {
    if (!this.filterform.value.status) return;
    if (this.filterform.value.status == 'all') {
      this.filterData.status = [0, 1];
    } else {
      this.filterData.status = this.filterform.value.status;
    }
    this.getAllUserData();
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
          this.comp = res.data;

          this.spinner.stop();
        }
      });
  }

  onChange(event: any) {
    this.filterData.page = event.page;
    if (this.filter == 'main') {
      this.getAllUserData();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    } else if (this.filter == 'filt') {
      this.onSubmit();
    }
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    if (this.filter == 'main') {
      this.getAllUserData();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    } else if (this.filter == 'filt') {
      this.onSubmit();
    }
  }
  updateFilter(event): void {
    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.events = val;
      this.filterData.searchQuery = val;
    } else {
      this.filterData.searchQuery = this.events;
    }
    this.filter = 'search';
    this.getAllUserData();
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
              permissionval.formName == 'EmployeeMaster' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeMaster' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeMaster' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeMaster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.COMPANYCONTACTSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.commonNotificationService.handleSuccess('User activated successfully');
              if (this.filter == 'main') {
                this.getAllUserData();
              } else if (this.filter == 'search') {
                this.updateFilter(this.events);
              } else if (this.filter == 'filt') {
                this.onSubmit();
              }
              this.spinner.stop();
            },
            (err) => {
              this.commonNotificationService.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }
  showAddNewModal() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCHECKUSERLIMIT, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.checkdata = res.data;

          if (this.checkdata.totalCount < this.checkdata.totalUser) {
            // this.router.navigate([
            //   this.adminRoot + '/masters/add_company_contact/' + localStorage.getItem('company_id'),
            // ]);

            this.formValueStorageService.navigate(
              'ListCompanyContactComponent',
              this.filterData,
              '/masters/add_company_contact',
              localStorage.getItem('company_id'),
            );
          } else {
            Swal.fire({
              title: 'Your limit exceed.',
              html: ' Please upgrade your subscription plan...<br>For upgrade plan <span style="color:blue">contact us.<span>',
              icon: 'error',
            });
          }

          this.spinner.stop();
        }
      });
  }
  onSubmit() {
    if (!this.filterform.valid) {
      return;
    }

    this.filterData.departmentID = this.filterform.value.department;
    this.filterData.designationID = this.filterform.value.designation;
    this.filterData.branchMasterID = this.filterform.value.branch;
    this.filterData.companyMasterID = this.filterform.value.company;
    this.filterData.workingAreaId = this.filterform.value.workingArea;
    this.filterData.divisionId = this.filterform.value.division;
    this.filterData.repoteeUserMasterID = this.filterform.value.repoteeUserMasterID;

    if (this.filterform.value.status == 'all') {
      this.filterData.status = [0, 1];
    } else {
      this.filterData.status = this.filterform.value.status;
    }

    this.filter = 'filt';

    this.getAllUserData();
  }

  clear() {
    window.location.reload();
  }

  downloadFile() {
    let body = {
      companyMasterID: this.filterData.companyMasterID
        ? this.filterData.companyMasterID
        : localStorage.getItem('company_id'),
      status: this.filterData.status,
      exportData: true,
      branchMasterID: this.filterData.branchMasterID,
      department: this.filterData.departmentID,
      designation: this.filterData.designationID,
      searchQuery: this.filterData.searchQuery,
      workingAreaId: this.filterData.workingAreaId,
      divisionId: this.filterData.divisionId,
      // For Field Name change
      pfNumber: this.pfNumber,
      pfJoiningDate: this.pfJoiningDate,
      pfBank: this.pfBank,
      pfBankIFSCCode: this.pfBankIFSCCode,
      pfBankAccountNumber: this.pfBankAccountNumber,
      esicNumber: this.esicNumber,
      esicJoiningDate: this.esicJoiningDate,
      esicEndMonth: this.esicEndMonth,
      salaryCalculationAct: this.salaryCalculationAct,
      aadharCardNumber: this.aadharCardNumber,
      nameOnAadhar: this.nameOnAadhar,
      viewAadhar: this.viewAadhar,
      showBankBranch: this.showBankBranch,
      bankIfscCodeLabel: this.bankIfscCodeLabel,
      MusterBoxNameLabel: this.MusterBoxNameLabel,
      showUanNumber: this.showUanNumber,
      showpfbankAccountNo: this.showpfbankAccountNo,
      showPanCard: this.showPanCard,
      showpfbankMasterID: this.showpfbankMasterID,
      showpfbankIFSC: this.showpfbankIFSC,
      showesicEndMonth: this.showesicEndMonth,
    };
    this.employeedata = [];

    this.spinner.start('main');
    this.api
      .callApi(this.constant.EXPORTUSERSALLDATA, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'EmployeeData.xlsx', 'text/xlsx');

          this.spinner.stop('main');
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }

  onImportUserSubmit() {
    if (!this.addimportuser.valid) {
      return;
    }

    const formData = new FormData();
    if (this.childcompany == 'false') {
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);
      formData.append('showBankBranch', this.showBankBranch);
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);
      formData.append('check', '0');
    } else {
      formData.append('file', this.file);
      formData.append('companyMasterID', localStorage.getItem('company_id'));
      formData.append('showBankBranch', this.showBankBranch);
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);
      formData.append('check', '0');
    }
    this.spinner.start();
    this.api.callApi(this.constant.UPLOADUSEREXCEL, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);

          setTimeout(() => {
            window.location.reload();
            this.spinner.stop();
          }, 3000);
        } else if (res.status == 402) {
          this.commonNotificationService.handleWarning(res.message, 'Validation');
          this.addimportuser.resetForm();
          this.showdemoexcel = false;
          this.spinner.stop();
        } else {
          this.commonNotificationService.handleError(res.message);

          this.addimportuser.resetForm();
          this.showdemoexcel = false;
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);

        this.spinner.stop();
      },
    );
  }

  onSelectImportFile(event: any) {
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  showDemoUpdateUser(id) {
    this.companyID = '';
    this.showdemoexcel1 = false;
    this.selectedbranch_update = null;
    this.allbranch_Update = [];

    if (!id) return;
    this.companyID = id;
    this.showdemoexcel1 = true;

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch_Update = res;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('branch');
      });
  }

  styleExcel(worksheet, name, data) {
    const header = worksheet.addRow([name]);

    // Apply style to header cell
    header.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '729fcf' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Apply style to data cells
    data.map((e) => {
      const row = worksheet.addRow([e]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
  }

  async downloadDemoImportUser() {
    let companyId = this.addimportuser.value.company;
    if (!companyId) return;
    this.spinner.start('downloadDemoImportUser');
    await Promise.all([
      this.getNationality(),
      this.getCompanyBranch(companyId),
      this.getCompanyDepartment(companyId),
      this.getCompanyDesignation(companyId),
      this.getCompanyShift(companyId),
      this.getCompanyAttendancePolicy(companyId),
      this.getSalaryPolicyData(companyId),
      this.getCompanyWeekOffPolicy(companyId),
      this.getCompanyHolidayPolicy(companyId),
      this.getGradeData(companyId),
      this.getStateData(),
      this.getBankData(),
      this.getCompanyRoles(companyId),
      this.getCompanyContractor(companyId),
    ]);

    let workbook = new Workbook();
    const joiningDataSheet = workbook.addWorksheet('Joining Data');
    const joiningDataSheetHeader = joiningDataSheet.addRow([
      'Employee_Code',
      'First_Name',
      'Middle_Name',
      'Last_Name',
      'Department',
      'Department Applicable Date',
      'Designation',
      'Designation Applicable Date',
      'Branch',
      'Branch Applicable Date',
      'Local_Address',
      'Permenet_Address',
      'Mobileno',
      'Email_Id',
      'Marital_Status',
      'SalaryBase',
      'Gender',
      'Bank',
      'AccountNo',
      'IFSCCode',
      'BirthDate',
      'JoinDate',
      'LeftDate',
      'PANNo',
      'AadharNo',
      'AadharName',
      'PFNo',
      'UANNo',
      'PF_JoinDate',
      'ESINo',
      'ESI_JoinDate',
      'PF_Bank',
      'PF_bankIFSC',
      'PF_bankACNO',
      'Employeement_Type',
      'Employment Applicable Date',
      'Employment End Date',
      'Contractor Name',
      'Salary Type',
      'Overtime',
      'Notice Period(in days)',
      'BloodGroup',
      'Nationality',
      'Physical_Handicap',
      'SHIFT',
      'Attendance_Policy',
      'Salary_Policy',
      'WeekOff_Policy',
      'Holiday_Policy',
      'Gross_Salary',
      'Salary_Grade',
      'StateForPT',
      'Corporation',
      'SkillCategory',
      'Biometric SerialNo',
      'Biometric Code',
      'Role',
      `${this.othernumberLabel}`,
      'Attendance From',
      'Cug Number',
      'Offical_MailId',
      this.showPayrollFrequency ? 'Payroll Frequency' : '',
    ]);

    const styledJoiningDataSheetHeader = [
      'First_Name',
      'Last_Name',
      'Department',
      'Department Applicable Date',
      'Designation',
      'Designation Applicable Date',
      'Branch',
      'Branch Applicable Date',
      'Mobileno',
      'JoinDate',
      'Employment Applicable Date',
      'Employeement_Type',
      'SkillCategory',
      'Role',
      this.showPayrollFrequency ? 'Payroll Frequency' : '',
    ];
    joiningDataSheetHeader.eachCell((cell) => {
      if (styledJoiningDataSheetHeader.includes(String(cell.value))) {
        if (cell.value != '') {
          cell.font = { bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF6666' }, // red background color
          };
        }
      } else {
        if (cell.value != '') {
          cell.font = { bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '729fcf' },
          };
        }
      }
    });
    this.addDataToSheet(workbook, true);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'add_JoiningData' + '.xlsx');
    });
    this.spinner.stop('downloadDemoImportUser');
  }

  getBasicInstructionSheet(workbook) {
    const basicInstructionSheet = workbook.addWorksheet('Basic Instructions');

    const basicInstructionSheetHeaders = basicInstructionSheet.addRow([
      'Marital_Status',
      'SalaryBase',
      'Employeement_Type',
      'Salary_Type',
      'Overtime',
      'BloodGroup',
      'Date Format',
      'Attendance From',
      this.showPayrollFrequency ? 'Payroll Frequency' : '',
    ]);

    basicInstructionSheetHeaders.eachCell((cell) => {
      if (cell.value != '') {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '729fcf' }, // green background color
        };
      }
    });

    const basicInstructionSheetData = [
      [
        'Single',
        'S',
        'Trainee',
        'W',
        'YES',
        'A+',
        'yyyy-mm-dd',
        this.attendanceFromENUM.MOBILE,
        this.showPayrollFrequency ? 'Monthly' : '',
      ],
      [
        'Widowed',
        'F',
        `${this.confirmLabel}`,
        'M',
        'NO',
        'B+',
        '',
        this.attendanceFromENUM.BIOMETRIC,
        this.showPayrollFrequency ? 'Fortnightly' : '',
      ],
      [
        'Separated',
        ' ',
        'Apprenticeship',
        'S',
        '',
        'B-',
        '',
        this.attendanceFromENUM.MOBILEANDBIOMETRIC,
        this.showPayrollFrequency ? 'Weekly' : '',
      ],
      ['Married', ' ', 'Probation', '', '', 'A-', '', '', ''],
      ['Divorced', '', 'Contract', '', '', 'O+', '', '', ''],
      ['', '', 'Locum', '', '', 'O-', '', '', ''],
      ['', '', '', '', '', 'AB+', '', '', ''],
      ['', '', '', '', '', 'AB-', '', '', ''],
    ];

    basicInstructionSheetData.map((e) => {
      basicInstructionSheet.addRow(e);
    });
  }

  getNationality(): Promise<void> {
    return new Promise((resolve) => {
      this.nationalityListService.fetchNationality().subscribe((res) => {
        this.nationalityList = res || [];
        this.nationalityListData = this.nationalityList.map((e) => e.name);
        resolve();
      });
    });
  }

  getCompanyBranch(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_branch = res.length > 0 ? res.map((b) => b.branchName) : [];
          resolve();
        });
    });
  }

  getCompanyDepartment(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_department =
            res.status === 200 && res.data.length > 0 ? res.data.map((d) => d.departmentName) : [];
          resolve();
        });
    });
  }

  getCompanyDesignation(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_designation =
            res.status === 200 && res.data.length > 0 ? res.data.map((d) => d.designationName) : [];
          resolve();
        });
    });
  }

  getCompanyShift(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.SHIFTBYCOMPANYDATA2 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_shift =
            res.status === 200 && res.data.length > 0 ? res.data.map((s) => s.shiftName) : [];
          resolve();
        });
    });
  }

  getCompanyAttendancePolicy(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.ATTENDANCEBYCOMPANYDATA2 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_attendance =
            res.status === 200 && res.data.length > 0
              ? res.data.map((a) => a.attendancePolicyName)
              : [];
          resolve();
        });
    });
  }

  getSalaryPolicyData(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.SALARYBYCOMPANYDATA2 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_salary =
            res.status === 200 && res.data.length > 0
              ? res.data.map((s) => s.salaryPolicyName)
              : [];
          resolve();
        });
    });
  }

  getCompanyWeekOffPolicy(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.WEEKOFFBYCOMPANYDATA2 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_weekoff =
            res.status === 200 && res.data.length > 0
              ? res.data.map((w) => w.weekOffPolicyName)
              : [];
          resolve();
        });
    });
  }

  getCompanyHolidayPolicy(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.HOLIDAYBYCOMPANYDATA2 + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_holiday =
            res.status === 200 && res.data.length > 0
              ? res.data.map((h) => h.holidayPolicyName)
              : [];
          resolve();
        });
    });
  }

  getGradeData(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.GETGRADEDATA + companyId, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.comp_grade =
            res.status === 200 && res.data.length > 0 ? res.data.map((g) => g.gradeName) : [];
          resolve();
        });
    });
  }

  getStateData(): Promise<void> {
    return new Promise((resolve) => {
      this.api
        .callApi(this.constant.GETSTATEBYCOUNTRY + 103, {}, 'GET', false, false, false)
        .subscribe((res: any) => {
          this.comp_state = res.data.length > 0 ? res.data.map((s) => s.stateName) : [];
          resolve();
        });
    });
  }

  getBankData(): Promise<void> {
    return new Promise((resolve) => {
      const filter = { page: '', limit: '' };
      this.api
        .callApi(this.constant.GETBANKDATA, filter, 'POST', false, true, true)
        .subscribe((res: any) => {
          this.comp_bankdata = res.data.length > 0 ? res.data.map((b) => b.bankName) : [];
          resolve();
        });
    });
  }

  getCompanyRoles(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      this.roleFilter = {
        page: null,
        limit: null,
        searchQuery: null,
        companyMasterID: companyId,
      };
      this.api
        .callApi(this.constant.LISTROLEMASTER, this.roleFilter, 'POST', false, true, true)
        .subscribe((res: any) => {
          this.comp_roledata = res.data.length > 0 ? res.data.map((e) => e.roleName) : [];
          resolve();
        });
    });
  }

  getCompanyContractor(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      const query = `?companyMasterID[]=${companyId}`;
      this.api
        .callApi(this.constant.GETALLDATA + query, {}, 'GET', true, true, true)
        .subscribe((res: any) => {
          this.comp_contractorNames =
            res.data.length > 0 ? res.data.map((e) => e.contractorName) : [];
          resolve();
        });
    });
  }

  getExportEmployeeData(companyId: any): Promise<void> {
    return new Promise((resolve) => {
      const body = {
        companyMasterID: companyId,
        status: 1,
        filter: 0,
        branchMasterID: this.selectedbranch_update,
      };
      this.api
        .callApi(this.constant.EXPORTUSEREXCEL, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          this.employeedata =
            res.data.length > 0 ? res.data.map((employee) => Object.values(employee)) : [];
          resolve();
        });
    });
  }
  onSubmitUpdateUserData() {
    if (!this.updateimportuser.valid) {
      return;
    }

    const formData = new FormData();

    formData.append('file', this.file);
    formData.append('companyMasterID', this.updateimportuser.value.company1);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('showBankBranch', this.showBankBranch);
    formData.append('check', '1');

    this.spinner.start();
    this.api.callApi(this.constant.UPLOADUSEREXCEL, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);

          setTimeout(() => {
            window.location.reload();
            this.spinner.stop();
          }, 3000);
        } else if (res.status == 402) {
          this.commonNotificationService.handleWarning(res.message, 'Validation');

          this.updateimportuser.resetForm();
          this.showdemoexcel = false;
          this.showdemoexcel1 = false;
          this.spinner.stop();
        } else {
          this.commonNotificationService.handleError(res.message);

          this.updateimportuser.resetForm();
          this.showdemoexcel = false;
          this.showdemoexcel1 = false;
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);

        this.spinner.stop();
      },
    );
  }

  async exportUpdateUserExcel() {
    let companyId = this.updateimportuser.value.company1;
    if (!companyId) return;
    this.spinner.start('downloadDemoImportUser');
    await Promise.all([
      this.getNationality(),
      this.getCompanyBranch(companyId),
      this.getCompanyDepartment(companyId),
      this.getCompanyDesignation(companyId),
      this.getCompanyShift(companyId),
      this.getCompanyAttendancePolicy(companyId),
      this.getSalaryPolicyData(companyId),
      this.getCompanyWeekOffPolicy(companyId),
      this.getCompanyHolidayPolicy(companyId),
      this.getGradeData(companyId),
      this.getStateData(),
      this.getBankData(),
      this.getCompanyRoles(companyId),
      this.getExportEmployeeData(companyId),
    ]);

    let workbook = new Workbook();

    // for joingdata sheet
    const joiningDataSheet = workbook.addWorksheet('Joining Data');
    const joiningDataSheetHeader = joiningDataSheet.addRow([
      'Employee_Code',
      'First_Name',
      'Middle_Name',
      'Last_Name',
      'Local_Address',
      'Permenet_Address',
      'Mobileno',
      'Email_Id',
      'Marital_Status',
      'SalaryBase',
      'Gender',
      'Bank',
      'AccountNo',
      'IFSCCode',
      'BirthDate',
      'JoinDate',
      'LeftDate',
      'PANNo',
      'AadharNo',
      'AadharName',
      'PFNo',
      'UANNo',
      'PF_JoinDate',
      'ESINo',
      'ESI_JoinDate',
      'PF_Bank',
      'PF_bankIFSC',
      'PF_bankACNO',
      'Employeement_Type',
      'Employment Applicable Date',
      'Employment End Date',
      'Salary Type',
      'Overtime',
      'Notice Period(in days)',
      'BloodGroup',
      'Nationality',
      'Physical_Handicap',
      'Attendance_Policy',
      'Salary_Policy',
      'WeekOff_Policy',
      'Holiday_Policy',
      'Gross_Salary',
      'Salary_Grade',
      'StateForPT',
      'Corporation',
      'SalaryFromYYYYMM',
      'Biometric SerialNo',
      'Biometric Code',
      'Role',
      `${this.othernumberLabel}`,
      'Attendance From',
      'Cug Number',
      'Offical_MailId',
      this.showPayrollFrequency ? 'Payroll Frequency' : '',
    ]);

    const styledJoiningDataSheetHeader = [
      'First_Name',
      'Last_Name',
      'Mobileno',
      'Employeement_Type',
      'JoinDate',
      'Employment Applicable Date',
      'Role',
      this.showPayrollFrequency ? 'Payroll Frequency' : '',
    ];
    joiningDataSheetHeader.eachCell((cell) => {
      if (styledJoiningDataSheetHeader.includes(String(cell.value))) {
        if (cell.value != '') {
          cell.font = { bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF6666' }, // red background color
          };
        }
      } else {
        if (cell.value != '') {
          cell.font = { bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '729fcf' },
          };
        }
      }
    });

    this.employeedata.map((e) => joiningDataSheet.addRow(e));
    this.addDataToSheet(workbook, false);
    // generate Excel
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'update_JoiningData' + '.xlsx');
    });

    this.spinner.stop('downloadDemoImportUser');
  }
  styleExcelMultipleColumns(worksheet, headers, dataArrays) {
    // Add header row
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '729fcf' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Get max length to loop through
    const maxLength = Math.max(...dataArrays.map((arr) => arr.length));

    for (let i = 0; i < maxLength; i++) {
      const rowData = dataArrays.map((arr) => arr[i] || '');
      const row = worksheet.addRow(rowData);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
  }

  addDataToSheet(workbook, addContractor: boolean) {
    this.getBasicInstructionSheet(workbook);
    const combinedSheetHeaderArray = [
      'Branch',
      ' ',
      'Department',
      ' ',
      'Designation',
      ' ',
      'Shift',
    ];
    const combinedSheetDataArray = [
      this.comp_branch,
      [],
      this.comp_department,
      [],
      this.comp_designation,
      [],
      this.comp_shift,
    ];
    if (addContractor) {
      combinedSheetHeaderArray.push('');
      combinedSheetHeaderArray.push('Contractor');
      combinedSheetDataArray.push([]);
      combinedSheetDataArray.push(this.comp_contractorNames);
    }
    const combinedSheet = workbook.addWorksheet('Company Master Data');
    this.styleExcelMultipleColumns(combinedSheet, combinedSheetHeaderArray, combinedSheetDataArray);

    const policyDataSheet = workbook.addWorksheet('Policy Data');
    this.styleExcelMultipleColumns(
      policyDataSheet,
      ['Attendance_Policy', ' ', 'Salary_Policy', ' ', 'WeekOff_Policy', ' ', 'Holiday_Policy'],
      [this.comp_attendance, [], this.comp_salary, [], this.comp_weekoff, [], this.comp_holiday],
    );

    const salaryGradeSheet = workbook.addWorksheet('Salary_Grade');
    this.styleExcelMultipleColumns(salaryGradeSheet, ['Salary_Grade'], [this.comp_grade]);

    const stateSheet = workbook.addWorksheet('States');
    this.styleExcelMultipleColumns(stateSheet, ['States'], [this.comp_state]);

    const bankSheet = workbook.addWorksheet('Banks');
    this.styleExcelMultipleColumns(bankSheet, ['Banks'], [this.comp_bankdata]);

    const roleSheet = workbook.addWorksheet('Roles');
    this.styleExcelMultipleColumns(roleSheet, ['Roles'], [this.comp_roledata]);

    const nationalitySheet = workbook.addWorksheet('Nationality');
    this.styleExcelMultipleColumns(nationalitySheet, ['Nationality'], [this.nationalityListData]);
  }
  showDemoUserExcelButton(id) {
    if (id == undefined) {
      this.companyID = '';
      this.showdemoexcel = false;
    } else {
      this.companyID = id;
      this.showdemoexcel = true;
    }
  }

  navigateToDeletePage(itemData: any): void {
    this.formValueStorageService.navigate(
      'ListEmployeeMasterComponent',
      this.filterData,
      '/masters/delete_employee',
      itemData.userMasterID,
    );
  }

  navigateToDeactivePage(itemData: any): void {
    this.formValueStorageService.navigate(
      'ListEmployeeMasterComponent',
      this.filterData,
      '/masters/deactive_employee',
      itemData,
    );
  }
  showImportOpeningBalanceModal() {
    this.router.navigate([this.adminRoot + '/masters/import_Initial_Leave_Opening_Balance']);
  }
  showUpdateBranchJob() {
    this.router.navigate([this.adminRoot + '/masters/bulkUpdateBranchJob']);
  }
  exportUsersProfilePic() {
    let body = {
      companyMasterID: this.filterData.companyMasterID
        ? this.filterData.companyMasterID
        : localStorage.getItem('company_id'),
      status: this.filterData.status,
      branchMasterID: this.filterData.branchMasterID,
      departmentID: this.filterData.departmentID,
      designationID: this.filterData.designationID,
      workingAreaId: this.filterData.workingAreaId,
      divisionId: this.filterData.divisionId,
    };

    this.spinner.start('profilePic');
    this.api
      .callApi(this.constant.BULKDOWNLOADPROFILEPICS, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.commonNotificationService.handleWarning('No data found to export!');
            this.spinner.stop('profilePic');
          } else {
            this.downloadFileService.handleFileDownload(res, 'profilePics.zip', 'text/zip');

            this.spinner.stop('profilePic');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message || 'Someting Went Wrong!');
          this.spinner.stop('profilePic');
        },
      );
  }
}
