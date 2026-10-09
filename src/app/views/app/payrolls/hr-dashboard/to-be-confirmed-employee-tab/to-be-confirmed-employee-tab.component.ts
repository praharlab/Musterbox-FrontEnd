import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-to-be-confirmed-employee-tab',
    templateUrl: './to-be-confirmed-employee-tab.component.html',
    styleUrls: ['./to-be-confirmed-employee-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ToBeConfirmedEmployeeTabComponent implements OnInit {
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
    exportData: false,
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
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {}

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

    this.filterData.companyMasterID = this.company_id;
    this.getToBeConfirmEmPloyeeData();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
     this.spinner.startLoader('master2');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stopLoader('master2');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stopLoader('master2');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stopLoader('master2');
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

     this.spinner.startLoader('master2');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.spinner.stopLoader('master2');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stopLoader('master2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master2');
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
    this.isResetForm = false;

     this.spinner.startLoader('master2');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.alldepartment = res.data;
        this.selectAllForDropdownItems(this.alldepartment);
        this.spinner.stopLoader('master2');
      });

     this.spinner.startLoader('master2');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stopLoader('master2');
      });

     this.spinner.startLoader('master2');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.selectAllForDropdownItems(this.alldesignation);
          this.spinner.stopLoader('master2');
        }
      });

     this.spinner.startLoader('master2');
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

        this.spinner.stopLoader('master2');
      });

     this.spinner.startLoader('master2');
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
        this.spinner.stopLoader('master2');
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
    this.getToBeConfirmEmPloyeeData();
  }

  getToBeConfirmEmPloyeeData() {
     this.spinner.startLoader('master2');

    this.api
      .callApi(this.constant.TOBECONFIRMEDEMPLOYEE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.handleSuccess(res.message);
            this.spinner.stopLoader('master2');
          } else {
            this.handleError(res.message);
            this.spinner.stopLoader('master2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master2');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getToBeConfirmEmPloyeeData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getToBeConfirmEmPloyeeData();
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
        exportData: false,
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
  private handleSuccess(message: any) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'To Be Confirmed Employee.xlsx');
    this.spinner.stopLoader('master2');
  }


  onDownloadClick() {
    this.filterData.exportData = true;
     this.spinner.startLoader('master2');
    this.api
      .callApi(this.constant.TOBECONFIRMEDEMPLOYEE, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.handleFileDownload(res);
          this.filterData.exportData = false;
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stopLoader('master2');
        },
      );
  }

  navigateToEditPage(itemData: any): void {
    this.formValueStorageService.navigate(
      'ListEmployeeMasterComponent',
      this.filterData,
      '/masters/edit_employee',
      itemData,
    );
  }
}
