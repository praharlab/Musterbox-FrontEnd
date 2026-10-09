import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-nda',
    templateUrl: './list-employee-nda.component.html',
    styleUrls: ['./list-employee-nda.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeNdaComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'NDA Name', prop: 'Ndaname' },
    { name: 'Company ID', prop: 'companyMasterID' },
    { name: 'Description', prop: 'description' },
    { name: 'PDF', prop: 'pdf' },
    { name: 'Given Date', prop: 'givendate' },
    { name: 'Show to Employee', prop: 'showtoemployee' },
    { name: 'Status', prop: 'status' },
  ];
  selected = ['NDA Name', 'NDA Category Name', 'User Name', 'PDF Download', 'Given Date', 'Status'];
  tabledata = [
    'NDA Name',
    'NDA Category Name',
    'User Name',
    'Company Name',
    'Description',
    'PDF Download',
    'Given Date',
    'Show to Employee',
    'Status',
    'CreateBy',
    'CreatedAt',
    'updateBy',
    'UpdatedAt',
  ];
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
    startdate: '',
    enddate: '',
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];
  http: any;
  usertype: any;
  company_id: any;

  events: any;
  excelevents: any;
  limit: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  adminRoot = environment.adminRoot;

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/payrolls/employee_nda',
          this.adminRoot + '/payrolls/employee_nda/edit_employee_nda',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListEmployeeNdaComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListEmployeeNdaComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        searchQuery: '',
        companyMasterID: localStorage.getItem('company_id'),
      };
    } else {
      this.filterData = this.formValue.ListEmployeeNdaComponent.body;
    }
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getNDAData();
    this.checkpermission();
  }

  getNDAData() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETALLEMPLOYEENDA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
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
              permissionval.formName == 'Nda' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return permissionval.formName == 'Nda' && permissionval.operationName.includes('Edit');
          });
          this.permissionview = permission.filter((permissionval) => {
            return permissionval.formName == 'Nda' && permissionval.operationName.includes('View');
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Nda' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getNDAData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getNDAData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getNDAData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getNDAData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  changeshowfields() {
    this.ngOnInit();
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;

    this.getNDAData();
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/employee_nda/add_employee_nda']);
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
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEEMPLOYEENDA + id, {}, 'GET', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getNDAData();
              this.spinner.stop('confirm');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          employeeNdaid: id,
          status: 0,
        };
        this.spinner.start('deactive');

        this.api.callApi(this.constant.UPDATEEMPLOYEENDA, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getNDAData();
            this.spinner.stop('deactive');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('deactive');
          },
        );
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
          employeeNdaid: id,
          status: 1,
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.UPDATEEMPLOYEENDA, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getNDAData();
            this.spinner.stop('active');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }

  downloadpdf(pdf: any) {
    const pdfUrl = this.apiURL + 'uploads/company/Nda/' + pdf;
    const pdfName = 'NDA';
    saveAs(pdfUrl, pdfName);
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListEmployeeNdaComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListEmployeeNdaComponent',
      this.filterData,
      '/payrolls/employee_nda/edit_employee_nda',
      rowData.employeeNdaid,
    );
  }
}
