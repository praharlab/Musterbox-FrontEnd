import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { UserFormValueStorageService } from 'src/app/services/user-form-value-storage.service';
import { HttpClient } from '@angular/common/http';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-list-task',
    templateUrl: './list-task.component.html',
    styleUrls: ['./list-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListTaskComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal3', { static: false }) lgModal3!: BsModalRef;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode.force;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: null,
    branchMasterID: null,
    userMasterID: null,
    tasks_stagesID: null,
    startDate: '',
    endDate: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  Curr_component: string = 'TASK';

  authdata: any;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;

  allStages: any;
  TaskINFO: any;
  TaskRemarks: any = [];
  adminRoot = environment.adminRoot;

  currentPage: number;
  formValue: any;
  display: boolean;

  ipAddress: any;
  TaskData: any = [];

  commonFilterData: any

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]
  reminderForm!: UntypedFormGroup;
  taskDetails: any = null;

  paginationReminder = {
    data: [],
    page: 1,
    limit: 10,
    totalCount: 0,
  };
  selectedTaskForReminder: any = null;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
    private userFormValueStorageService: UserFormValueStorageService,
    private http: HttpClient,
    private fb: UntypedFormBuilder
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/tasks/task',
            this.adminRoot + '/tasks/task/edit_task',
            this.adminRoot + '/userprofile',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeComponentData('ListTaskComponent', false);
            formValueStorageService.removeData('commonFilterData', true);
          }
        }
      });
    }
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/tasks/task',
            this.adminRoot + '/tasks/task/edit_task',
            this.adminRoot + '/userprofile',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            userFormValueStorageService.removeData();
          }
        }
      });
    }
  }
  ngOnInit() {

    this.reminderForm = this.fb.group({
      message: ['', Validators.required]
    });

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyComponent('ListTaskComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        companyMasterID: +localStorage.getItem('company_id'),
        branchMasterID: null,
        userMasterID: null,
        tasks_stagesID: null,
        startDate: '',
        endDate: '',
      };
    } else {
      this.filterData = this.formValue.ListTaskComponent?.body ? this.formValue.ListTaskComponent?.body : this.formValue.ListTaskComponent;
    }

    this.checkpermission()
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };
  }

  getTaskByCompany() {
    this.spinner.start('createTask');

    this.api
      .callApi(this.constant.GETTASKBYCOMPANY2, this.filterData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
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
              permissionval.formName == 'AssignTask' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignTask' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignTask' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignTask' &&
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
      this.getTaskByCompany();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getTaskByCompany();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/tasks/task/add_task']);
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
          user_TasksID: id,
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETETASK2, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getTaskByCompany();
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
    this.commonFilterData = null
    this.filterData = {
      page: 1,
      limit: 10,
      searchQuery: '',
      companyMasterID: null,
      branchMasterID: null,
      userMasterID: null,
      tasks_stagesID: null,
      startDate: '',
      endDate: '',
    };
    this.formValueStorageService.removeComponentData('ListTaskComponent', false);
    this.userFormValueStorageService.removeData();
    setTimeout(() => {
      this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
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

  view(att: any) {
    window.open(this.apiURL + 'uploads/task/' + att, '_blank');
  }
  onSubmit(val: any) {
    this.commonFilterData = val;
    this.filterData.startDate = val.fromdate;
    this.filterData.endDate = val.todate;
    this.filterData.companyMasterID = val.company;
    if (val.user)
      this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;

    if (val.stages)
      this.filterData.tasks_stagesID = +val.stages;

    this.getTaskByCompany();
  }

  showdata(row: any) {
    this.TaskINFO = row;
    this.spinner.start('getRemark');
    this.api
      .callApi(this.constant.GETTASKREMARK + row.user_TasksID, {}, 'GET', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.TaskRemarks = res.data;

            for (var i = 0; i < this.TaskRemarks.length; i++) {
              if (i == this.TaskRemarks.length - 1) {
                this.TaskRemarks[i].updatedAt = '';
              } else {
                this.TaskRemarks[i].updatedAt = this.TaskRemarks[i + 1].createdAt;
              }
            }
          }
          this.spinner.stop('getRemark');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getRemark');
        },
      );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getTaskByCompany();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getTaskByCompany();
    }
  }

  download() {
    let body1 = {
      page: '',
      limit: '',
      searchQuery: this.filterData.searchQuery,
      companyMasterID: this.filterData.companyMasterID,
      userMasterID: this.filterData.userMasterID,
      tasks_stagesID: this.filterData.tasks_stagesID,
      startDate: this.filterData.startDate,
      endDate: this.filterData.endDate,
      exportData: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.GETTASKBYCOMPANY2, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'Task.xlsx');
          this.spinner.stop('download');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
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
      'ListTaskComponent',
      this.filterData,
      '/tasks/task/edit_task',
      rowData.user_TasksID,
    );
  }
  onActivate(event) {
    if (event.type == 'click') {
      this.display = false;
    }
    if (event.cellIndex == 0) {
      this.formValueStorageService.addData('ListTaskComponent', this.filterData);
      this.userFormValueStorageService.navigate('/userprofile', event.row.userMasterID);
    }
  }

  getSubTaskByID(id: any) {
    this.TaskData = [];
    const body = {
      user_TasksID: id,
    };
    this.spinner.start('confirm');
    this.api.callApi(this.constant.GETSUBTASKBYID, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.TaskData = res.data.map((task: any) => {
            return {
              ...task,
              TaskDesc: task.TaskDesc ? task.TaskDesc : '',
            };
          });
        }
        this.spinner.stop('confirm');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('confirm');
      },
    );
  }
  getMainTaskByID(id: any) {
    this.TaskData = [];
    const body = {
      parentuserTasksID: id,
    };
    this.spinner.start('confirm');
    this.api.callApi(this.constant.GETMAINTASKBYID, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.TaskData = res.data.map((task: any) => {
            return {
              ...task,
              TaskDesc: task.TaskDesc ? task.TaskDesc : '',
            };
          });
        }
        this.spinner.stop('confirm');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('confirm');
      },
    );
  }
  loadComponent(component) {
    if (component) this.Curr_component = component;

    if (component == 'MAINTASK') this.getMainTaskByID(this.TaskINFO.parentuserTasksID);

    if (component == 'SUBTASK') this.getSubTaskByID(this.TaskINFO.user_TasksID);
  }
  changeTab() {
    this.Curr_component = 'TASK';
  }

  getCompany(val: any) {
    this.filterData.companyMasterID = val;
    this.getTaskByCompany();
  }

  getAllTaskStages(companyMasterID: number) {
    let temp = {
      page: '',
      limit: '',
      companyMasterID: companyMasterID,
    };

    this.spinner.start('12');
    this.api
      .callApi(this.constant.GETALLTASKSTAGES, temp, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allStages = res.data;

          this.spinner.stop('12');
        }
      });
  }

  initData(companyMasterID: number) {
    this.getAllTaskStages(companyMasterID);
  }

  sendReminder() {
    if (this.reminderForm.invalid) {
      this.reminderForm.markAllAsTouched();
      return;
    }
    this.spinner.start();
    const data = {
      user_TasksID: this.taskDetails?.user_TasksID,
      userMasterID: this.taskDetails?.userMasterID,
      TaskName: this.taskDetails?.TaskName,
      startDate: this.taskDetails?.startDate,
      endDate: this.taskDetails?.endDate,
      tasks_stagesID: this.taskDetails?.tasks_stagesID,
      allTaskStage: this.taskDetails?.allTaskStage,
      message: this.reminderForm.value?.message
    }
    this.api
      .callApi(this.constant.SENDREMINDER, data, 'POST', true, false, true)
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.notifications.create('Success', 'Reminder sent successfully!', NotificationType.Success, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.lgModal3.hide();
            this.reminderForm.reset();
          } else if (res.status === 429) {
            this.lgModal3.hide();
            this.reminderForm.reset();
            const readableTime = new Date(res.nextReminderTime).toLocaleString(); // or use a date pipe / moment
            this.notifications.create(
              'Warning',
              `Reminder already sent. Try again after ${readableTime}.`,
              NotificationType.Warn,
              {
                theClass: 'outline warning',
                timeOut: 5000,
                showProgressBar: false,
              }
            );
          } else {
            this.notifications.create('Error', 'Failed to send reminder. Please try again.', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          }

          this.spinner.stop();
        },
        error: (err) => {
          this.notifications.create('Error', 'Something went wrong while sending the reminder.', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      });

  }

  loadData(data) {
    this.paginationReminder.page = 1;
    this.selectedTaskForReminder = data;
    this.fetchReminders();
  }

  fetchReminders() {
    this.spinner.start();
    const filterData = {
      limit: this.paginationReminder.limit,
      page: this.paginationReminder.page,
      receiverId: this.selectedTaskForReminder.userMasterID,
      user_TasksID: this.selectedTaskForReminder.user_TasksID
    };

    this.api
      .callApi(this.constant.GETALLREMINDER, filterData, 'POST', true, true, true)
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.paginationReminder.data = res.data;
            this.paginationReminder.totalCount = res.totalRecords;
          } else {
            this.notifications.create(
              'Error',
              'Fetching Failed',
              NotificationType.Error,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              }
            );
          }
          this.spinner.stop();
        },
        error: (err) => {
          this.handleError(err);
          this.spinner.stop();
        },
      });
  }

  getTotalPages(): number {
    return Math.ceil(this.paginationReminder.totalCount / this.paginationReminder.limit);
  }

  changePage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.paginationReminder.page = page;
    this.fetchReminders();
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
