import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import {
  CommonFilterFields,
  CommonFilterButtonFields,
  ItemOptionsPerPageArray,
  CommonRequiredFields,
} from 'src/app/constants/CommonFilterFields';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
@Component({
    selector: 'app-asset-report',
    templateUrl: './asset-report.component.html',
    styleUrls: ['./asset-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AssetReportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
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
    assetcategory: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number;
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
  childcompany: string;
  cid: string;
  selected1: any = [];
  companydata: any;
  allasset: any = [];
  selected2: any = [];
  salary: boolean;
  public users: Array<any> = [];
  employee: any;
  allbranch: any;
  branchfilter: boolean = false;
  employeedata: any;
  rows1: any;

  userMasterID: any = [];
  allWorkingArea: any;
  alldesignation: any;
  alldepartment: any;
  allDivision: any;

  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  selectedAssetCategory: any[];
  isResetForm: boolean = false;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
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
              permissionval.formName == 'AssetReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.filterData.page = 1;
    this.filterData.assetcategory = val?.assetcat ? val?.assetcat : [];
    this.filterData.userMasterID =
      val.user != null && Array.isArray(val.user) && val.user.length > 0
        ? val.user
        : this.userMasterID;
    this.getAssestData();
  }

  getAssestData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.ASSETREPORT, this.filterData, 'POST', true, false, true)
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
      this.getAssestData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      if (this.filterData.page && this.filterData.assetcategory && this.filterData.userMasterID) {
        this.getAssestData();
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
        assetcategory: '',
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
    this.spinner.start('start');
    let body1 = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      assetcategory: this.filterData.assetcategory,
      exportData: true,
    };
    this.api.callApi(this.constant.ASSETREPORT, body1, 'POST', true, false, true, true).subscribe(
      (res: any) => {
        this.downloadFileService.handleFileDownload(res, 'Asset Report.xlsx', 'text/xlsx');
        this.spinner.stop('start');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }
  getassetCategory(id) {
    this.spinner.start('assetCategory');
    this.api
      .callApi(this.constant.GETASSETCATEGORYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allasset = res.data;
        this.selectAllForDropdownItems(this.allasset);

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('assetCategory');
      });
  }
  getCompany(val: any) {
    this.getassetCategory(val);
  }
  allUsers(users: any) {
    this.userMasterID = users.map((x) => x.userMasterID);
  }
}
