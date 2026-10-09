import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { IpAddressService } from 'src/app/services/ip-address.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-advance-report',
    templateUrl: './advance-report.component.html',
    styleUrls: ['./advance-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdvanceReportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  rows1 = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: '',
    companyMasterID: '',
    startdate: '',
    enddate: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissionview: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  alluser: any;
  company1: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  resultColumns1: any[];
  childcompany: string;
  cid: string;
  selected1: any = [];
  companydata: any;
  allasset: any = [];
  selected2: any = [];
  salary: boolean;
  companymasterName: any;
  public users: Array<any> = [];
  employee: any;
  allbranch: any;
  branchfilter: boolean = false;
  employeedata: any;
  currentPage: number;
  userMasterID: any = [];

  allWorkingArea: any;
  alldesignation: any;
  alldepartment: any;
  allDivision: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentID: [],
    designationID: [],
    divisionId: [],
    workingAreaId: []
  }
  selecteddesig: any[];
  selectedDivision: any[];
  selectedWorkingArea: any[];
  selectedDepartment: any[];
  selectedUser: any[];
  selectedBranch: any[];
  isResetForm: boolean = false;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status,];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private ipAddressService: IpAddressService,
    private downloadFileService: DownloadFileService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.checkpermission();
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdvanceReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  onSubmit(val?: any) {
    // if (!this.datefilter.valid) {
    //   return;
    // }
    this.filterData.page = 1;
    this.filterData.userMasterID = val.user != null && (Array.isArray(val.user) && val.user.length > 0) ? val.user : this.userMasterID;
    this.filterData.startdate = val.startdate;
    this.filterData.enddate = val.enddate.slice(0, 10);
    this.filterData.companyMasterID = val?.company;

    this.getAdvanceReportData();
  }

  getAdvanceReportData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.ADVANCEREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
          this.spinner.stop();
        }
      });
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;

      this.getAdvanceReportData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      if (this.filterData.page &&
        this.filterData.startdate &&
        this.filterData.enddate &&
        this.filterData.companyMasterID) {
        this.getAdvanceReportData();
      }

    } else {
      console.log('error');
    }
  }

  clear() {
    this.isResetForm = true;
    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        userMasterID: '',
        companyMasterID: '',
        startdate: '',
        enddate: '',
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
      this.ngOnInit();
    }, 200);
    this.isResetForm = false;
  }

  download() {
    let body1 = {
      page: '',
      limit: '',
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      companyMasterID: this.filterData.companyMasterID,
      userMasterID: this.filterData.userMasterID,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.ADVANCEREPORT, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          this.downloadFileService.handleFileDownload(res, 'Advance Report.xlsx', 'text/xlsx')
          this.spinner.stop('start');

        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  allUsers(users: any) {
    this.userMasterID = users.map((x) => x.userMasterID);
  }

}
