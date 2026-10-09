import { Component, ViewChild, OnInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-accident',
    templateUrl: './list-employee-accident.component.html',
    styleUrls: ['./list-employee-accident.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeAccidentComponent implements OnInit {
  ipAddress: any;

  @ViewChild('listAccident') listAccident: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  permissioncreate = [];
  permissionedit: any;
  permissionview: any;
  permissiondelete: any;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    userMasterID: '',
    startdate: '',
    enddate: '',
    branchMasterID: null,
  };
  commonFilterData: any

  page = {
    totalCount: 0,
    offset: 0,
  };
  rows = [];
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private ren: Renderer2,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/payrolls/list_employee_accident',
          this.adminRoot + '/payrolls/list_employee_accident/edit_employee_accident',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeAccidentComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListEmployeeAccidentComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: +localStorage.getItem('company_id'),
        branchMasterID: null,
        userMasterID: '',
        startdate: '',
        enddate: '',
      };
    } else {
      this.filterData = this.formValue.ListEmployeeAccidentComponent.body;
    }

    this.page = {
      totalCount: 0,
      offset: 0,
    };

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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeAccident' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeAccident' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeAccident' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeAccident' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getAccidentData() {
    this.spinner.start('onpageload');

    this.api
      .callApi(this.constant.GETEMPACCIDENTDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('onpageload');
          } else {
            this.handleError(res.message);
            this.spinner.stop('onpageload');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('onpageload');
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

  onSubmit(val?: any) {
    this.commonFilterData = val;
    this.filterData.companyMasterID = val?.company;
    this.filterData.userMasterID = val?.user;
    this.filterData.startdate = val?.fromdate;
    this.filterData.enddate = val?.todate;
    this.getAccidentData();
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAccidentData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getAccidentData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/list_employee_accident/add_employee_accident']);
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          AccidentID: id,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };

        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEEMPACCIDENTDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getAccidentData();
                this.spinner.stop('confirm');
              } else {
                this.handleError(res.message);
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  clear() {
    this.commonFilterData = null
    this.formValue = this.formValueStorageService.getData();
    this.rows = []
    this.filterData = {
      page: this.formValue.ListEmployeeAccidentComponent?.body?.page ? this.formValue.ListEmployeeAccidentComponent?.body?.page : 1,
      limit: this.formValue.ListEmployeeAccidentComponent?.body?.limit ? this.formValue.ListEmployeeAccidentComponent?.body?.limit : 10,
      companyMasterID: null,
      userMasterID: '',
      startdate: '',
      enddate: '',
      branchMasterID: null,
    };
    this.formValueStorageService.removeData('ListEmployeeAccidentComponent', false);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListEmployeeAccidentComponent',
      this.filterData,
      '/payrolls/list_employee_accident/edit_employee_accident',
      rowData.AccidentID,
    );
  }

  getCompany(companyMasterID: number){
    this.filterData.companyMasterID = companyMasterID;
    this.getAccidentData();
  }
}
