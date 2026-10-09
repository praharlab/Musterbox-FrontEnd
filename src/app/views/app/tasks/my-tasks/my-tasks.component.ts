import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-my-tasks',
    templateUrl: './my-tasks.component.html',
    styleUrls: ['./my-tasks.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyTasksComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('addcomp') addcomp: NgForm;

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
    searchQuery: '',
    userMasterID: localStorage.getItem('id'),
    tasks_stagesID: '',
    startDate: '',
    endDate: '',
  };
  body = {
    page: 1,
    limit: 10,
    createBy: localStorage.getItem('id'),
  };
  body1 = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    createBy: localStorage.getItem('id'),
    userID: '',
  };
  body2 = {
    id: localStorage.getItem('id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  getStatus: any;
  filter: any;
  userid: any = [];
  export: any;
  authdata: any;
  childcompany: any;
  rows1: any;
  allcomp: any;
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
  taskname: any;
  nextstage: any;
  nextstageID: any;
  remark1: any;
  taskID: any;
  taskstageID: any;
  ipAddress: any;
  nextstage_ID: any;
  TaskINFO: any;
  TaskRemarks: any = [];
  adminRoot = environment.adminRoot;
  updated: any;
  TaskData: any = [];
  Curr_component: string = 'TASK';
  body4: any;
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
    private notifications: AppNotificationService,
    private router: Router,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.spinner.start('createTask');
    this.api
      .callApi(this.constant.GETTASKBYUSERV3, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.filter = 'main';
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('createTask');
        }
      });

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.userid = localStorage.getItem('id');
    this.childcompany = localStorage.getItem('childcompany');
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
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyTask' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MyTask' && permissionval.operationName.includes('View')
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
    this.filterData.page = e.offset + 1;
    if (this.filter == 'main') {
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    }
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    if (this.filter == 'main') {
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    }
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/tasks/add_task']);
  }

  clear() {
    window.location.reload();
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

  updateFilter(event): void {
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    this.filterData.searchQuery = val;
    this.spinner.start('createTask');
    this.api
      .callApi(this.constant.GETTASKBYUSERV3, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.filter = 'search';
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('createTask');
        }
      });
  }

  alertDeactiveConfirmation(id: any, status: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to Accept the Task!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          user_TasksID: id,
          status: 1,
        };
        this.spinner.start('acc');
        this.api.callApi(this.constant.TASKACCEPTREJECT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.spinner.stop('acc');
            this.ngOnInit();
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop('acc');
          },
        );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to Reject the Task!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          user_TasksID: id,
          status: 2,
        };
        this.spinner.start('acc');
        this.api.callApi(this.constant.TASKACCEPTREJECT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.spinner.stop('acc');
            this.ngOnInit();
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop('acc');
          },
        );
      }
    });
  }

  editstage(row: any) {
    this.taskname = row.TaskName;
    this.nextstageID = row.user_TasksID;
    this.nextstage = '';
    // this.nextstageID = ''
    this.spinner.start('acc1');
    this.api
      .callApi(this.constant.GETNEXTSTAGEBYID + row.user_TasksID, {}, 'GET', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let data11 = {};
            if (res.data.length != 0) {
              this.nextstage = res.data[0].TaskStage;
              this.nextstage_ID = res.data[0].tasks_stagesID;
            } else {
              this.nextstage = 'Task Completed';
            }
          }
          this.spinner.stop('acc1');
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('acc1');
        },
      );
  }

  showdata(row: any) {
    this.TaskINFO = row;
    this.spinner.start('getRemark');
    this.api
      .callApi(this.constant.GETTASKREMARK + row.user_TasksID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
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
      });
  }

  onSubmit12() {
    if (!this.addcomp.valid) {
      return;
    }

    let body = {
      user_TasksID: this.nextstageID,
    };

    this.spinner.start('add');
    this.api
      .callApi(this.constant.UPDATETASKSTAGE2, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.updated = true;
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
        if (this.updated == true) {
          let body1 = {
            remark: this.addcomp.value.remark,
            user_TasksID: this.nextstageID,
            tasks_stagesID: this.nextstage_ID,
            createBy: localStorage.getItem('id'),
            createByIp: this.ipAddress,
          };

          this.spinner.start('addremark');
          this.api
            .callApi(this.constant.ADDREMARK, body1, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                setTimeout(() => {
                  this.closeModal1.nativeElement.click();
                  this.spinner.stop('addremark');
                  this.ngOnInit();
                }, 3000);
                this.updated = false;
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('addremark');
              }
            });

          this.addcomp.resetForm();
          this.closeModal.nativeElement.click();
          this.spinner.stop('add');
        }
      });
  }

  currentTaskID(event: any, event1: any) {
    this.taskID = event;
    this.taskstageID = event1;
  }

  onSubmit13() {
    this.nextstageID;

    if (!this.addcomp1.valid) {
      return;
    }
    let tempval = this.addcomp1.value.remark1;
    this.addcomp1.resetForm();
    this.addcomp1.reset();

    let body = {
      remark: tempval,
      user_TasksID: this.taskID,
      tasks_stagesID: this.taskstageID,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.spinner.start('addremark');
    this.api
      .callApi(this.constant.ADDREMARK, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.closeModal1.nativeElement.click();
            this.spinner.stop('addremark');
            this.ngOnInit();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('addremark');
        }
      });

    let body1 = {
      user_TasksID: this.taskID,
      status: 1,
    };
    this.spinner.start('acc');
    this.api.callApi(this.constant.TASKACCEPTREJECT, body1, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.spinner.stop('acc');
        this.ngOnInit();
      },
      (err) => {
        console.log('error', err);
        this.spinner.stop('acc');
      },
    );
  }

  view(att: any) {
    window.open(this.apiURL + 'uploads/task/' + att, '_blank');
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  loadComponent(component) {
    if (component) this.Curr_component = component;

    if (component == 'MAINTASK') this.getMainTaskByID(this.TaskINFO.parentuserTasksID);

    if (component == 'SUBTASK') this.getSubTaskByID(this.TaskINFO.user_TasksID);
  }
  changeTab() {
    this.Curr_component = 'TASK';
  }

  loadData(data) {
    this.selectedTaskForReminder = data;
    this.fetchReminders();
  }

  fetchReminders() {
    this.spinner.start();
    const filterData = {
      limit: this.paginationReminder.limit,
      page: this.paginationReminder.page,
      receiverId: localStorage.getItem('id'),
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
}
