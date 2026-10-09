import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-daily-ot-report',
    templateUrl: './daily-ot-report.component.html',
    styleUrls: ['./daily-ot-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DailyOtReportComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  company: any;
  permissionview: any = [];
  allbranch: any;
  alluser: any;
  selectedBranch: any = '';
  selectedCompany: any;
  selectedBranch1: any;
  selectedEmployees: any = [];
  user_body = {
    companyMasterID: '',
    branchMasterID: '',
    employeeStartDate: '',
    employeeEndDate: '',
    branchStartDate: '',
    branchEndDate: '',
  }

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    startDate: '',
    endDate: '',
    authorizationStatus: [],
    Export: ''
  }
  companyid: number;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,

  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit() {
    this.companyid = +localStorage.getItem('company_id')
    this.allbranch = [];
    this.alluser = [];
    this.rows = []
    this.checkpermission();
    this.getcompany();
    this.selectcompany(this.companyid)

  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('comp');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('comp');
        }
      });

  }

  getUsers() {

    this.spinner.start('emp');
    this.api
      .callApi(
        this.constant.GETALLUSERS,
        this.user_body,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          this.spinner.stop('emp');
        } else {
          this.spinner.stop('emp');
        }
      });
  }

  selectcompany(id) {
    this.allbranch = [];
    this.alluser = [];
    this.selectedBranch = '';
    this.selectedEmployees = [];
    this.selectedCompany = id;

    if (!id) return;

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });
    this.spinner.stop('branch');

    this.user_body.companyMasterID = id;
    this.user_body.employeeStartDate = this.datefilter ? this.datefilter.value.startdate : '';
    this.user_body.employeeEndDate = this.datefilter ? this.datefilter.value.enddate : '';
    this.user_body.branchMasterID = '';
    this.user_body.branchStartDate = '';
    this.user_body.branchEndDate = '';
    this.getUsers();

  }

  selectbranch(id) {
    this.alluser = [];
    this.selectedEmployees = [];
    this.selectedBranch1 = id;
    if (id) {
      this.user_body.companyMasterID = this.selectedCompany;
      this.user_body.employeeStartDate = this.datefilter.value.startdate;
      this.user_body.employeeEndDate = this.datefilter.value.enddate;
      this.user_body.branchMasterID = id;
      this.user_body.branchStartDate = this.datefilter.value.startdate;
      this.user_body.branchEndDate = this.datefilter.value.enddate;
      this.getUsers();

    } else {
      if (this.selectedCompany) {
        this.user_body.companyMasterID = this.selectedCompany;
        this.user_body.employeeStartDate = this.datefilter.value.startdate;
        this.user_body.employeeEndDate = this.datefilter.value.enddate;
        this.user_body.branchMasterID = '';
        this.user_body.branchStartDate = '';
        this.user_body.branchEndDate = '';
        this.getUsers();
      }
    }
  }

  selectdate() {
    if (this.datefilter.value.startdate && this.datefilter.value.enddate) {
      if (this.selectedCompany && this.selectedBranch1) {
        this.user_body.branchMasterID = this.selectedBranch1;
        this.user_body.branchStartDate = this.datefilter.value.startdate;
        this.user_body.branchEndDate = this.datefilter.value.enddate;
        this.user_body.companyMasterID = this.selectedCompany;
        this.user_body.employeeStartDate = this.datefilter.value.startdate;
        this.user_body.employeeEndDate = this.datefilter.value.enddate;
        this.getUsers();
      } else if (this.selectedCompany && !this.selectedBranch1) {
        this.user_body.branchMasterID = '';
        this.user_body.branchStartDate = '';
        this.user_body.branchEndDate = '';
        this.user_body.employeeStartDate = this.datefilter.value.startdate;
        this.user_body.employeeEndDate = this.datefilter.value.enddate;
        this.getUsers();
      }

    }
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
              permissionval.formName == 'DailyOvertimeReport' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop('permission');
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) return

    this.filterData.Export = ''
    this.filterData.companyMasterID = this.datefilter.value.cid
    this.filterData.branchMasterID = this.datefilter.value.branch
    this.filterData.userMasterID = this.datefilter.value.employee ? this.datefilter.value.employee : []
    this.filterData.startDate = this.datefilter.value.startdate
    this.filterData.endDate = this.datefilter.value.enddate
    this.filterData.authorizationStatus = this.datefilter.value.authStatus ? this.datefilter.value.authStatus : []
    this.spinner.start('getData');
    this.api
      .callApi(
        this.constant.DAILYOTREPORT,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount

          this.spinner.stop('getData');
        } else {
          this.spinner.stop('getData');
        }
      }, (err) => {
        this.handleError(err.error.message || 'Someting Went Wrong!')
        this.spinner.stop('getData');
      });

  }

  Export() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.Export = 'true'

    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.DAILYOTREPORT,
        this.filterData,
        'POST',
        true,
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.handleError('No data found to export!')
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Daily OT Report (${this.filterData.startDate}) - (${this.filterData.endDate}).xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {

          this.handleError(err.error.message || 'Someting Went Wrong!')
          this.spinner.stop('a');
        },
      );
  }


  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.onSubmit();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.onSubmit();
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


  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);

  }

}
