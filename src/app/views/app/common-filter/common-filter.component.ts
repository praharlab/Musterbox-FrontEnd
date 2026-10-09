import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Observable } from 'rxjs';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  CommonRequiredFields,
} from 'src/app/constants/CommonFilterFields';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-common-filter',
    templateUrl: './common-filter.component.html',
    styleUrls: ['./common-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CommonFilterComponent implements OnInit {
  @ContentChildren(NgModel, { descendants: true }) dynamicFields: QueryList<NgModel>;
  @ViewChild('filterForm', { static: true }) filterForm: NgForm;
  @ViewChild('submitBtn') submitBtn: ElementRef<HTMLButtonElement>;

  // @Input('enableFilter') enableFilter: boolean = true;
  @Input('hideFilters') hideFilters: CommonFilterFields[] = [];
  @Input('showRequiredFields') showRequiredFields: CommonRequiredFields[] = [
    CommonRequiredFields.Company,
    CommonRequiredFields.User,
  ];
  public filterFields = CommonFilterFields;
  public requiredFields = CommonRequiredFields;
  // Use Keys : ['company', 'branch', 'department', 'designation', 'division', 'workingArea', 'user', 'status', 'project']

  @Input('showButtons') showButtons: CommonFilterButtonFields[] = [];
  @Input('heading') heading: string = '';
  @Input('cancelRoute') cancelRoute: string = '';
  @Input('importButtonLabel') importButtonLabel: string = 'Import';
  @Input('userBindValue') userBindValue: string = 'userMasterID';
  @Input('multiUser') multiUser: boolean = true;
  @Input('multiBranceh') multiBranch: boolean = true;
  @Input('multiDepartment') multiDepartment: boolean = true;
  @Input('multiDesignation') multiDesignation: boolean = true;
  @Input('showExtraButton') showExtraButton: boolean = false;
  @Input('extraButtonName') extraButtonName: string = 'Button';
  @Input('customExportButtonName') customExportButtonName: string = 'Export Excel';
  @Input('showCustomExportButton') showCustomExportButton: boolean = false;
  @Input('customPdfButtonName') customPdfButtonName: string = 'Export Pdf';
  @Input('showCustomPdfButton') showCustomPdfButton: boolean = false;
  @Input('extraButtonType') extraButtonType: string = 'button';
  public buttonFields = CommonFilterButtonFields;
  // Use Keys: ['submit', 'clear', 'excel', 'pdf']

  employmentTypes: string[] = labelUtils.EmployementType;

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onPdfSubmit = new EventEmitter<any>();
  @Output() onExcelSubmit = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();
  @Output() export = new EventEmitter<any>();
  @Output() exportCSV = new EventEmitter<any>();
  @Output() import = new EventEmitter<any>();
  @Output() getPdf = new EventEmitter<any>();
  @Output() clearData = new EventEmitter<any>();
  @Output() getCompany = new EventEmitter<any>();
  @Output() getBranch = new EventEmitter<any>();
  @Output() clearCompany = new EventEmitter<any>();
  @Output() initData = new EventEmitter<any>();
  @Output() getUser = new EventEmitter<any>();
  @Output() onExportWithLog = new EventEmitter<any>();
  @Output() sendMail = new EventEmitter<any>();
  @Output() onExtraButtonClick = new EventEmitter<any>();
  @Output() getBodyValue = new EventEmitter<any>();

  // Use form event to take form for validations like "form.submitted"
  @Output() init = new EventEmitter<NgForm>();
  @Output() emitUsers = new EventEmitter<NgForm>();
  @Output() onSubmitWithoutValidation = new EventEmitter<any>();

  permissionview: any = [];
  preventEvent: boolean = false;

  usertype: any;
  company_id: any;
  adminRoot = environment.adminRoot;

  body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: '',
    fromDate: '',
    toDate: '',
    status: '1',
    projectID: '',
    skillCategory: '',
  };

  isResetForm: boolean = false;
  scrollBarHorizontal = window.innerWidth < 1201;
  allCompanies: any = [];
  allBranches: any = [];
  allDepartments: any = [];
  allDesignations: any = [];
  allDivisions: any = [];
  allWorkingAreas: any = [];
  allUsers: any = [];
  allProjects: any = [];
  allSkillCategories: any = [];

  emitInitial: boolean = true;

  selectedUsers: any;
  selectedBranch: string = null;
  selectedDepartment: any = null;
  selectedDivision: any = null;
  selectedDesignation: any = null;
  selectedProject: any;
  selectedSkillCategory: any;
  selectedWorkingArea: any = null;
  selectedStatus: any = '1';
  selectedSalaryType: any;
  selectedEmployementType: any;
  finalBody = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: '',
    projectID: '',
    skillCategory: '',
    salarytype: '',
    employmentType: '',
    status: '1',
  };

  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    // this.getAllCompanies();
  }

  ngAfterViewInit(): void {
    this.getAllCompanies();
  }

  ngAfterContentInit() {
    // Ensure all dynamically added fields are registered in the form
    this.dynamicFields.forEach((field) => {
      this.filterForm.addControl(field);
    });
  }

  async selectcompany(id, reset?: boolean) {
    if (reset && this.formValue?.commonFilterData?.user) {
      this.formValue.commonFilterData.user = [];
    }
    if (reset && this.formValue?.commonFilterData?.department) {
      this.formValue.commonFilterData.department = null;
    }
    if (reset && this.formValue?.commonFilterData?.designation) {
      this.formValue.commonFilterData.designation = null;
    }
    if (reset && this.formValue?.commonFilterData?.division) {
      this.formValue.commonFilterData.division = null;
    }
    if (reset && this.formValue?.commonFilterData?.workingArea) {
      this.formValue.commonFilterData.workingArea = null;
    }
    if (reset && this.formValue?.commonFilterData?.projectID) {
      this.formValue.commonFilterData.projectID = null;
    }
    if (reset && this.formValue?.commonFilterData?.skillCategory) {
      this.formValue.commonFilterData.skillCategory = null;
    }
    if (reset && this.formValue?.commonFilterData?.salarytype) {
      this.formValue.commonFilterData.salarytype = null;
    }
    if (reset && this.formValue?.commonFilterData?.employmentType) {
      this.formValue.commonFilterData.employmentType = null;
    }
    const resultPromise: Promise<any>[] = [];
    this.selectedUsers = null;
    this.selectedBranch = null;
    this.selectedDepartment = null;
    this.selectedDesignation = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;
    this.selectedProject = null;
    this.selectedSkillCategory = null;
    this.selectedSalaryType = null;
    this.selectedEmployementType = null;
    this.allBranches = [];
    this.allUsers = [];
    this.allDepartments = [];
    this.allDesignations = [];
    this.allDivisions = [];
    this.allWorkingAreas = [];
    this.allProjects = [];
    this.clearData.emit();

    if (id) {
      if (this.formValueStorageService.isEmptyComponent('commonFilterData'))
        this.getCompany.emit(id);
      this.initData.emit(id);

      this.body.companyMasterID = id;
      this.finalBody.companyMasterID = id;
      this.getBodyValue.emit(this.finalBody);
      if (!this.hideFilters.includes(this.filterFields.Branch))
        resultPromise.push(this.getAllBranches(id));

      if (!this.hideFilters.includes(this.filterFields.User))
        resultPromise.push(this.getAllUsers());

      if (!this.hideFilters.includes(this.filterFields.Department))
        resultPromise.push(this.getAllDepartments(id));

      if (!this.hideFilters.includes(this.filterFields.Designation))
        resultPromise.push(this.getAllDesignations(id));

      if (!this.hideFilters.includes(this.filterFields.Division))
        resultPromise.push(this.getAllDivisions(id));

      if (!this.hideFilters.includes(this.filterFields.Project))
        resultPromise.push(this.getAllProjects(id));

      if (!this.hideFilters.includes(this.filterFields.WorkingArea))
        resultPromise.push(this.getAllWorkingAreas(id));
    }

    if (!this.formValueStorageService.isEmptyComponent('commonFilterData')) {
      const data = await this.allSettled(resultPromise);
      this.setFilters().then(() => this.submitBtn.nativeElement.click());
      // this.setFilters().then(() => this.onSubmitClick());
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  getAllCompanies() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('company');
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allCompanies = res.data;
            setTimeout(() => {
              this.company_id = this.formValue?.commonFilterData?.company
                ? this.formValue?.commonFilterData?.company
                : +localStorage.getItem('company_id');
              this.selectcompany(this.company_id);
            });
            this.spinner.stop('company');
          }
        });
    } else {
      const body = {
        companyMasterID: +localStorage.getItem('company_id'),
      };
      this.spinner.start('company');
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allCompanies = res.data;
            setTimeout(() => {
              this.company_id = this.formValue?.commonFilterData?.company
                ? this.formValue?.commonFilterData?.company
                : +localStorage.getItem('company_id');
              this.selectcompany(this.company_id);
            }, 50);
            this.spinner.stop('company');
          }
        });
    }
  }

  getAllUsers(reset?: boolean) {
    return new Promise<void>((resolve, reject) => {
      if (reset && this.formValue?.commonFilterData?.user) {
        this.formValue.commonFilterData.user = [];
      }
      this.allUsers = [];
      this.selectedUsers = null;

      if (this.isResetForm) return;
      const body: any = {};
      body.status = this.filterForm.value.status ? this.filterForm.value.status : 1;
      body.companyMasterID = this.filterForm.value.company
        ? this.filterForm.value.company
        : this.company_id;
      if (this.filterForm.value.branch) body.branchMasterID = this.filterForm.value.branch;
      if (this.filterForm.value.department) body.departmentID = this.filterForm.value.department;
      if (this.filterForm.value.designation) body.designationID = this.filterForm.value.designation;
      if (this.filterForm.value.division) body.divisionId = this.filterForm.value.division;
      if (this.filterForm.value.workingArea) body.workingAreaId = this.filterForm.value.workingArea;
      if (this.filterForm.value.projectID) body.projectID = this.filterForm.value.projectID;
      if (this.filterForm.value.skillCategory)
        body.skillCategory = this.filterForm.value.skillCategory;
      if (this.filterForm.value.salarytype) body.salarytype = this.filterForm.value.salarytype;
      if (this.filterForm.value.employmentType)
        body.employmentType = this.filterForm.value.employmentType;
      this.spinner.start('user');
      this.api.callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allUsers = res.data;
            if (this.multiUser) this.selectAllForDropdownItems(this.allUsers);
            if (
              this.emitInitial &&
              this.formValueStorageService.isEmptyComponent('commonFilterData')
            ) {
              this.init.emit(this.allUsers);
            }
            if (
              (!this.formValue?.commonFilterData?.user ||
                this.formValue?.commonFilterData?.user?.length == 0) &&
              !this.emitInitial
            ) {
              this.emitUsers.emit(this.allUsers);
            }
            resolve();
            this.emitInitial = false;
          }
          this.spinner.stop('user');
        },
        (error) => {
          reject();
          this.spinner.stop('user');
        },
      );
    });
  }

  getAllBranches(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allBranches = res;
          if (this.multiBranch) this.selectAllForDropdownItems(this.allBranches);
          this.spinner.stop('branch');
          resolve();
        });
    });
  }

  getAllDepartments(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('dep');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allDepartments = res.data;
          this.selectAllForDropdownItems(this.allDepartments);
          this.spinner.stop('dep');
          resolve();
        });
    });
  }

  getAllDesignations(id?: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('desig');
      this.api
        .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allDesignations = res.data;
            this.selectAllForDropdownItems(this.allDesignations);
            this.spinner.stop('desig');
          }
          resolve();
        });
    });
  }

  getAllWorkingAreas(id?: any) {
    return new Promise<void>((resolve, reject) => {
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
          this.allWorkingAreas = res.data;
          this.spinner.stop('workingArea');
          resolve();
        });
    });
  }

  getAllDivisions(id?: any) {
    return new Promise<void>((resolve, reject) => {
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
          this.allDivisions = res.data;
          this.spinner.stop('Division');
          resolve();
        });
    });
  }

  getAllProjects(id: any) {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start();
      const body = {
        companyMasterID: id,
        status: 1,
      };
      this.api
        .callApi(this.constant.LISTPROJECT, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allProjects = res.data;
            this.spinner.stop();
            resolve();
          }
        });
    });
  }

  clear(reset: boolean) {
    if (reset) this.formValueStorageService.removeData('commonFilterData', true);
    this.isResetForm = true;
    this.body.companyMasterID = null;
    this.filterForm.resetForm();
    this.spinner.start('clear');
    setTimeout(() => {
      this.emitInitial = true;
      this.company_id = +localStorage.getItem('company_id');
      this.isResetForm = false;
      this.onClear.emit();
      this.selectcompany(this.company_id, true);
      this.spinner.stop('clear');
    }, 200);
  }

  onExport() {
    this.export.emit(this.filterForm.value);
  }

  onImport() {
    this.import.emit();
  }

  onClickPdf() {
    this.getPdf.emit();
  }

  onSubmitClick() {
    this.onSubmitWithoutValidation.emit(this.filterForm.value);
    if (!this.filterForm.valid) return;
    if (Array.isArray(this.filterForm.value?.user) && this.filterForm.value?.user?.length == 0)
      this.filterForm.value.user = null;
    this.onSubmit.emit(this.filterForm.value);
  }

  onPdfClick() {
    if (!this.filterForm.valid) return;
    this.onPdfSubmit.emit(this.filterForm.value);
  }

  onExcelClick() {
    if (!this.filterForm.valid) return;
    this.onExcelSubmit.emit(this.filterForm.value);
  }

  cancel() {
    this.router.navigate([this.adminRoot + this.cancelRoute]);
  }
  onExportCSV() {
    this.exportCSV.emit();
  }

  onExportWithLogs() {
    this.onExportWithLog.emit();
  }
  onSendMailClick() {
    this.sendMail.emit();
  }

  emitUser(val: any) {
    this.getUser.emit(this.selectedUsers);
    if (Array.isArray(val) && val?.length == 0) {
      if (this.allUsers?.length > 0) this.emitUsers.emit(this.allUsers);
    }
  }

  emitExtraButtonClick() {
    this.onExtraButtonClick.emit(this.filterForm.value);
  }

  allSettled<T>(
    promises: Promise<T>[],
  ): Promise<({ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: any })[]> {
    return Promise.all(
      promises.map((p) =>
        p
          .then((value) => ({ status: 'fulfilled' as const, value }))
          .catch((reason) => ({ status: 'rejected' as const, reason })),
      ),
    );
  }

  setFilters(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.preventEvent = true;
      if (this.formValue?.commonFilterData)
        Object.keys(this.formValue?.commonFilterData).map((key) => {
          if (
            this.filterForm.controls.hasOwnProperty(key) &&
            this.formValue?.commonFilterData[key] &&
            key != 'user'
          ) {
            this.filterForm.controls[key].setValue(this.formValue?.commonFilterData[key]);
          }
        });
      this.preventEvent = false;
      this.getAllUsers().then(() => {
        if (
          this.filterForm.controls.hasOwnProperty('user') &&
          this.formValue?.commonFilterData['user']
        ) {
          this.filterForm.controls['user'].setValue(this.formValue?.commonFilterData['user']);
        }
        resolve();
      });
    });
  }

  selectBranch() {
    if (this.preventEvent) return;
    if(this.filterForm.value.branch && this.filterForm.value?.branch?.length > 0) this.getBranch.emit(this.filterForm.value.branch);
    if (!this.hideFilters.includes(this.filterFields.User)) this.getAllUsers(true);
  }

  selectDepartment() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectDesignation() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectDivision() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectWorkingArea() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectProject() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectSkill() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectSalaryType() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectEmployement() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }

  selectStatus() {
    if (this.preventEvent) return;
    this.getAllUsers(true);
  }
}
