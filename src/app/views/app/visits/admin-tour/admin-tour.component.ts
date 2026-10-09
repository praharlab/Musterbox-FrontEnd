import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import {
  CommonFilterButtonFields,
  CommonFilterFields,
  CommonRequiredFields,
  ItemOptionsPerPageArray,
} from 'src/app/constants/CommonFilterFields';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-admin-tour',
    templateUrl: './admin-tour.component.html',
    styleUrls: ['./admin-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdminTourComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  adminRoot = environment.adminRoot;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  scrollBarHorizontal: boolean;
  allbranch: any;
  selected3: any = [];
  designation1: any;
  alldepartment: any;
  selected2: any = [];
  empList: any;
  selected: any = [];
  usertype: string;
  company_id: string;
  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [
    CommonFilterButtonFields.Submit,
    CommonFilterButtonFields.Clear,
  ];
  showRequiredFields: any = [CommonRequiredFields.Company];
  commonFilterData: any;

  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    userMasterID: null,
    startdate: '',
    enddate: '',
    companyMasterID: localStorage.getItem('company_id'),
    branchMasterID: '',
    departmentid: '',
    designationid: '',
    page: 1,
    limit: 10,
    Export: false,
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  // body = {
  //   userid: '',
  //   startdate: '',
  //   enddate: '',
  //   companyMasterID: localStorage.getItem('company_id'),
  //   branchid: '',
  //   departmentid: '',
  //   designationid: '',
  //   page: 1,
  //   limit: 10,
  // };
  limit: number;
  filter: any;
  temp: any[];
  resultColumns: any = [];
  selected1: any = [];
  final: any = [];
  rows: any = [];
  currentPage: any;

  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/visits/admin-tour',
          this.adminRoot + '/visits/tour/edit_tour',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('commonFilterData', true);
          formValueStorageService.removeData('ListTourComponent', true);
        }
      }
    });
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
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
              permissionval.formName == 'AdminTour' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdminTour' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdminTour' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdminTour' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getTourData() {
    this.spinner.start('12');
    this.api
      .callApi(this.constant.GETTOURBYCOMPANY, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          // this.filter = 'main';
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          // setTimeout(() => {
          this.currentPage = this.filterData.page;
          // });

          this.spinner.stop('12');
        }
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

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getTourData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    this.getTourData();
  }

  onSubmit(val?: any) {
    this.commonFilterData = val;

    this.resultColumns = [];

    this.filterData.startdate = val.startdate || '';
    this.filterData.enddate = val.enddate || '';
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.departmentid = val.department || '';
    this.filterData.designationid = val.designation || '';
    this.filterData.branchMasterID = val.branch || '';
    this.filterData.companyMasterID = this.company_id;
    this.filterData.Export = false;

    this.getTourData();
  }

  clear() {
    this.commonFilterData = null;
    this.formValue = this.formValueStorageService.getData();
    this.rows = [];
    this.filterData = {
      userMasterID: null,
      startdate: '',
      enddate: '',
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: '',
      departmentid: '',
      designationid: '',
      page: this.formValue.ListTourComponent?.body?.page
        ? this.formValue.ListTourComponent?.body?.page
        : 1,
      limit: this.formValue.ListTourComponent?.body?.limit
        ? this.formValue.ListTourComponent?.body?.limit
        : 10,
      Export: false,
    };
    this.formValueStorageService.removeComponentData('ListTourComponent', true);
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
        //  const body = {
        //   ToursMasterID: id,
        //  }
        this.spinner.start();
        this.api.callApi(this.constant.DELETETOURDATA + id, {}, 'GET', true, true, true).subscribe(
          (res: any) => {
            this.ngOnInit();
            this.spinner.stop();
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop();
          },
        );
      }
    });
  }

  download() {
    this.filterData.Export = true;

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETTOURBYCOMPANY, this.filterData, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `Tour Report.xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }

  navigateToEditPage(rowData: any): void {
    if (
      this.commonFilterData &&
      this.commonFilterData != null &&
      Object.keys(this.commonFilterData).length > 0
    )
      this.formValueStorageService.addData('commonFilterData', this.commonFilterData);
    this.formValueStorageService.navigate(
      'ListTourComponent',
      {
        navigatedFrom: '/visits/admin-tour',
        ...this.filterData,
      },
      '/visits/tour/edit_tour',
      rowData.TourID,
    );
  }

  init(val: any) {
    // this.filterData.userMasterID = val.map((x) => x.userMasterID);
    this.getTourData();
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
