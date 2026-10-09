import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-auto-mail-setup',
    templateUrl: './list-auto-mail-setup.component.html',
    styleUrls: ['./list-auto-mail-setup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAutoMailSetupComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [
    'TaskName',
    'TaskDescription',
    'attachment',
    'priority',
    'tasktype',
    'tasks_stage',
    'taskStatus',
  ];
  SelectionType = SelectionType;
  tabledata = [
    'TaskName',
    'TaskDescription',
    'attachment',
    'priority',
    'tasktype',
    'startDate',
    'startTime',
    'endDate',
    'tasks_stage',
    'taskStatus',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    search: '',
    companyMasterID: +localStorage.getItem('company_id'),
    mailType: null
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  events: any;
  getStatus: any;
  userid: any = [];
  export: any;
  authdata: any;
  childcompany: any;
  rows1: any;
  allcomp: any = [];
  userID: any;
  dataprogess: any;
  referencedata: any;
  displayName: any;
  finalbranch: any;
  alldepartment: any;
  allbranch: any;
  ownerList: any;
  finalholidaypolicy: any;
  empList: any;
  excelevents: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  usertype: any;
  company_id: any;
  selectedemp: any;
  allStages: any;
  finalstage: string;
  TaskINFO: any;
  TaskRemarks: any = [];
  adminRoot = environment.adminRoot;
  selectedValue: any;

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
          this.adminRoot + '/tasks/task',
          this.adminRoot + '/tasks/edit_task',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListAutoMailSetupComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.userid = localStorage.getItem('id');
    this.childcompany = localStorage.getItem('childcompany');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListAutoMailSetupComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        search: '',
        companyMasterID: +localStorage.getItem('company_id'),
        mailType: null,
      };
    } else {
      this.filterData = this.formValue.ListAutoMailSetupComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAutoMailSetup();
    this.getcompany();
    this.checkpermission();
    // this.getTaskdata()
  }

  getAutoMailSetup() {
    this.spinner.start('createTask');

    this.api
      .callApi(this.constant.LISTAUTOMAILSETUP, this.filterData, 'POST', true, true, true)
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
            this.spinner.stop('createTask');
          } else {
            this.handleError(res.message);
            this.spinner.stop('createTask');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('createTask');
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
              permissionval.formName == 'AutoMailSetup' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AutoMailSetup' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AutoMailSetup' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AutoMailSetup' &&
              permissionval.operationName.includes('Create')
            );
          });
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
      this.getAutoMailSetup();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAutoMailSetup();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/utilitys/Auto-Mail-Setup/Add-Auto-Mail-Setup']);
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
        this.api.callApi(this.constant.DELETEAUTOMAILSETUP + id, {}, 'DELETE', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getAutoMailSetup();
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

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListAutoMailSetupComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('company');
      this.api.callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop('company');
          } else {
            this.handleError(res.message);
            this.spinner.stop('company');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company');
        },
      );
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('company');
      this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop('company');
          } else {
            this.handleError(res.message);
            this.spinner.stop('company');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company');
        },
      );
    }
  }


  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyMasterID = +this.datefilter.value.company;
    this.filterData.mailType = this.datefilter.value.mailType;

    this.getAutoMailSetup();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.search = '';
      setTimeout(() => {
        this.getAutoMailSetup();
      }, 100);
    } else {
      this.filterData.search = inputValue;
      this.getAutoMailSetup();
    }
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListAutoMailSetupComponent',
      this.filterData,
      '/utilitys/Auto-Mail-Setup/Edit-Auto-Mail-Setup',
      rowData.id,
    );
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
