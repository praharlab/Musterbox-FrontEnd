import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm, NgModel } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-user-checklist',
    templateUrl: './list-user-checklist.component.html',
    styleUrls: ['./list-user-checklist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListUserChecklistComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('addcomp2') addcomp2: NgForm;
  rows = [];
  apiURL = environment.apiUrl;
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
    userMasterID: localStorage.getItem('id'),
    searchQuery: '',
    toDate: '',
    fromDate: '',
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
  date: any;
  allChecklist: any = [];
  checkedCheckedList: any;
  adminRoot = environment.adminRoot;
  limit = 10;
  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/checklists/userCheckList',
          this.adminRoot + '/checklists/userCheckList/edit_userCheckList',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListUserChecklistComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListUserChecklistComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        userMasterID: localStorage.getItem('id'),
        searchQuery: '',
        toDate: '',
        fromDate: '',
      };
    } else {
      this.filterData = this.formValue.ListUserChecklistComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getAllUserCheckList();
    this.checkpermission();
  }

  getAllUserCheckList() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.GETALLUSERCHECKLIST, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.date = res.date;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
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
              permissionval.formName == 'MyCheckList' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyCheckList' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyCheckList' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyCheckList' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    this.filterData.page = 1
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAllUserCheckList();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAllUserCheckList();
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
  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }
    this.filterData.fromDate = this.addcomp2.value.startdate;
    this.filterData.toDate = this.addcomp2.value.enddate;
    
    this.getAllUserCheckList();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllUserCheckList();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllUserCheckList();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/checklists/userCheckList/add_userCheckList']);
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
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLIST, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getAllUserCheckList();
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
          checkListID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLIST, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAllUserCheckList();
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
          checkListID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLIST, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAllUserCheckList();
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

  view(row: any) {
    this.getAllChecklist(row.checkListID, row);
  }

  getAllChecklist(id: any, editData: any) {
    this.allChecklist = [];
    if (id) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCHECKISTQBYUSER + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allChecklist = res.data;
            this.checkedCheckedList = editData.filledChecklistQID;
            for (var i = 0; i < this.allChecklist.length; i++) {
              if (editData.filledChecklistQID.includes(this.allChecklist[i].checkListQuestionID)) {
                this.allChecklist[i].status = true;
                let index = editData.filledChecklistQID.indexOf(
                  this.allChecklist[i].checkListQuestionID,
                );
                this.allChecklist[i].createdAt = editData.filledChecklistQDate[index];
              } else {
                this.allChecklist[i].status = false;
                this.allChecklist[i].createdAt = '';
              }
            }
            this.spinner.stop();
          }
        });
    }
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
      'ListUserChecklistComponent',
      this.filterData,
      '/checklists/userCheckList/edit_userCheckList',
      rowData.userChecklistID,
    );
  }

  clear() {
    this.addcomp2.resetForm();

    this.formValueStorageService.removeData('ListUserChecklistComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
}
