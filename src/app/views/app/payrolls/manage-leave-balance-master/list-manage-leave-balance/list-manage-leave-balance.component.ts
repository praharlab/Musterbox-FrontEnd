import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-list-manage-leave-balance',
    templateUrl: './list-manage-leave-balance.component.html',
    styleUrls: ['./list-manage-leave-balance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListManageLeaveBalanceComponent implements OnInit {

  permissioncreate: any = [];
  permissionview: any = [];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: [],
    companyMasterID: null,
    exportData: false
  };
  commonFilterData: any
  rows: any = []
  page = {
    totalCount: 0,
    offset: 0,
  };
  currentPage: number = 1

  formValue: any

  columns: any = []

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    const protectedRoutes = [
      this.adminRoot + '/payrolls/manage-leave-balance',
      this.adminRoot + '/payrolls/manage-leave-balance/view',
    ];

    const isProtectedRoute = protectedRoutes.some((route) => router.url.includes(route));
    if (!isProtectedRoute) {
      formValueStorageService.removeData('ListManageLeaveBalanceComponent', false);
      formValueStorageService.removeData('commonFilterData', true);
    }
  }

  ngOnInit(): void {
    this.checkpermission()
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAllData();
    } else {
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/manage-leave-balance/add']);
  }

  clearData() {
    this.formValue = this.formValueStorageService.getData();
    this.filterData = {
      page: this.formValue.ListManageLeaveBalanceComponent?.body?.page ? this.formValue.ListManageLeaveBalanceComponent?.body?.page : 1,
      limit: this.formValue.ListManageLeaveBalanceComponent?.body?.limit ? this.formValue.ListManageLeaveBalanceComponent?.body?.limit : 10,
      userMasterID: [],
      companyMasterID: null,
      exportData: false
    };
    this.rows = [];
    this.commonFilterData = null;
    this.formValueStorageService.removeComponentData('ListManageLeaveBalanceComponent', true)
  }

  onSubmit(val: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterID = val.company;
    this.filterData.userMasterID = val.user;
    this.getAllData()
  }

  init(val: any) {
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.filterData.userMasterID = val.user;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.GETALLUSERLEAVESBALANCEDATA, this.filterData, 'POST', true, true, true, this.filterData.exportData)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.filterData.exportData = false;
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `ManageLeaveBalanceData.xlsx`);
          this.spinner.stop('getAll');
        } else {
          if (res.status == 200) {
            this.rows = res.data;
            if(this.rows.length > 0){
              this.showButtons.push(CommonFilterButtonFields.Excel)
              this.currentPage = this.filterData.page
            }else{
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            if(this.rows.length > 0)
            this.columns = Object.keys(this.rows[0]).filter(key => key !== 'userMasterID');
            this.page.totalCount = res.totalCount;
          }
          this.spinner.stop('getAll');
        }
      });
  }

  onPageChange(data) {
    this.filterData.page = data.page;
    this.filterData.limit = data.itemsPerPage;
    this.getAllData();
  }

  onChange(val: any) {
    this.filterData.page = val.page
    this.getAllData()
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
              permissionval.formName == 'ManageLeaveBalance' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ManageLeaveBalance' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  viewData(id: any) {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListManageLeaveBalanceComponent',
      this.filterData,
      '/payrolls/manage-leave-balance/view',
      id,
    );
  }

  export(){
    this.filterData.exportData = true;
    this.getAllData()
  }
}
