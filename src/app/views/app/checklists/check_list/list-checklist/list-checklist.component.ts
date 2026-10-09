import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-checklist',
    templateUrl: './list-checklist.component.html',
    styleUrls: ['./list-checklist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListChecklistComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'checkListID' },
    { name: 'Company Name', prop: 'companyName' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['checkListID', 'checkListName', 'designationName', 'Company', 'Status'];
  SelectionType = SelectionType;
  tabledata = ['checkListID', 'checkListName', 'designationName', 'Company', 'Status'];
  // selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: Number(localStorage.getItem('company_id')),
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];

  permissioncreate = [];
  permissionedit = [];
  permissionview: any = [];
  permissiondelete = [];
  events: any;

  limit = 10;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: Number(localStorage.getItem('company_id')),
      searchQuery: '',
    };

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAllCheckListData();
    this.checkpermission();
  }

  getAllCheckListData() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETALLCHECKLISTDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('main');
          } else {
            this.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main');
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
              permissionval.formName == 'CheckListMaster' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CheckListMaster' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CheckListMaster' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CheckListMaster' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    this.filterData.page = 1;
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAllCheckListData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAllCheckListData();
    }
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    // this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllCheckListData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllCheckListData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/checklists/checklist/add_checklist']);
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
          checkListID: id,
          status: '2',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLIST, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getAllCheckListData();
                this.spinner.stop();
              } else {
                this.notifications.create(
                  'Error',
                  'You cannot delete this checklist because it is filled by an employee',
                  NotificationType.Bare,
                  { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
                );
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
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
          checkListID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLIST, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getAllCheckListData();
                this.spinner.stop();
              } else {
                this.notifications.create(
                  'Error',
                  'You cannot deactive this checklist because it is filled by an employee',
                  NotificationType.Bare,
                  { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
                );
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
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
          checkListID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLIST, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAllCheckListData();
              this.spinner.stop();
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop();
            },
          );
      }
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
