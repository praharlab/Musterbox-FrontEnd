import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-list-employee-punch-in-punch-out',
    templateUrl: './list-employee-punch-in-punch-out.component.html',
    styleUrls: ['./list-employee-punch-in-punch-out.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeePunchInPunchOutComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('datefilter') datefilter: NgForm;
  childcompany: string;
  cid: string;
  page = {
    totalCount: 0,
    offset: 0,
  };
  usertype: any;
  company_id: any;
  alldepartment: any;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    fromdate: '',
    todate: '',
    userMasterID: []
  };
  company1: any;
  designation1: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  SelectionType = SelectionType;
  allbranch: any = [];
  alluser: any;
  datesArray: any[];
  selected: any = [];
  selected1: any = [];
  selected2: any = [];
  selected3: any = [];
  attendancedata: any = [];
  branchfilter: boolean = false;
  employee: any = [];
  employeedata: any;
  selected4: any[];
  enddate: Date;
  selectedBranch: any;
  selectedDepartment: any = [];
  selectedUsers: any = [];
  selectedValue: any;
  currentPage: number;
  allWorkingArea: any;
  allDivision: any;
  alldesignation: any;
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  isResetForm: boolean = false;
  formValue: any;
  users_Body = {
    companyMasterID: '',
  }
  adminRoot = environment.adminRoot;
  itemsPerPage = 10;
  reprortype = "intimeouttime"
  rows: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    this.filterData.companyMasterID = +this.formValue.PunchInOutGraphComponent.id;
    this.filterData.fromdate = this.formValue.PunchInOutGraphComponent.body;
    this.filterData.todate = this.formValue.PunchInOutGraphComponent.body;

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +this.formValue.PunchInOutGraphComponent.id;
    this.cid = this.formValue.PunchInOutGraphComponent.id;
    this.getcompany();
    this.getUsers();

    this.users_Body = {
      companyMasterID: '',
    }

  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        }
      });
  }

  getUsers() {
    let body = {
      companyMasterID: this.company_id,
    }
    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.selectAllForDropdownItems(this.employee);
          this.getAttendacneReportData();

        }
        this.spinner.stop('users');
      });
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeData('ListEmployeePunchInPunchOutComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
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

    this.filterData.companyMasterID = +this.formValue.PunchInOutGraphComponent.id;
    this.filterData.fromdate = this.datefilter.value.fromdate;
    this.filterData.todate = this.datefilter.value.fromdate;
    this.filterData.userMasterID = this.employee.map(e => e.userMasterID);
    this.getAttendacneReportData();
  }

  getAttendacneReportData() {
    this.filterData.companyMasterID = +this.formValue.PunchInOutGraphComponent.id;
    // this.filterData.fromdate = this.formValue.PunchInOutGraphComponent.body;
    // this.filterData.todate = this.formValue.PunchInOutGraphComponent.body;
    this.filterData.userMasterID = this.employee.map(e => e.userMasterID)

    this.spinner.start('alldata');
    this.api
      .callApi(this.constant.ATTENDANCEREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          setTimeout(() => {
            this.currentPage = this.filterData.page;

            this.itemsPerPage = this.filterData.limit;
          }, 200);
          this.page.totalCount = res.totalCount;
        }
        this.spinner.stop('alldata');
      });
  }


  selectfrom() {
    this.enddate = new Date();
  }
  download() {
    if (!this.datefilter.valid) {
      return;
    }

    let body = {
      page: '',
      limit: '',
      companyMasterID: +this.formValue.PunchInOutGraphComponent.id,
      fromdate: this.datefilter.value.fromdate,
      todate: this.datefilter.value.fromdate,
      userMasterID: this.employee.map(e => e.userMasterID),
      generateExcelFile: this.datefilter.value.reprttype == 'dailyattendance' ? '8' : '9', //Static Excel code for Register 1
      exportFileType: 'xlsx',
    };

    this.spinner.start('loader');
    this.api
      .callApi(this.constant.ATTENDANCEREPORT, body, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'Attendance Register 1.csv');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Attendance Register 1.xlsx');
        }
        this.spinner.stop('loader');
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAttendacneReportData();

    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAttendacneReportData();

    } else {
      this.handleError('Something Went Wrong!');
    }
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


  checkColor(item: any) {
    if (item.attendancetype == 'P') return 'present';
    if (item.attendancetype == 'A') return 'absent';
    if (item.attendancetype == 'HD') return 'halfday';
    if (item.attendancetype == '-') return 'absent';
    if (item.attendancetype == 'MissPunch') return 'notpunchout';
    if (item.attendancetype.includes('weekoff')) return 'weekoff';
    if (item.attendancetype.includes('holiday')) return 'holiday';
    if (item.attendancetype.includes('Optional')) return 'holiday';
    if (
      item.attendancetype.includes('P') &&
      (item.PenaltyDeduction || item.goEarlyPanaltyDeduction)
    )
      return 'penaltywithdeduction';
    if (
      item.attendancetype.includes('P') &&
      (item.attendancetype.includes('P') || item.attendancetype.includes('P'))
    )
      return 'penaltywithoutdeduction';

    return 'leave';
  }
}
