import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-task-stages',
    templateUrl: './task-stages.component.html',
    styleUrls: ['./task-stages.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TaskStagesComponent implements OnInit {
  @ViewChild('addtaskstage') addtaskstage: NgForm;
  @ViewChild('edittaskstage') edittaskstage: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;

  rows = [];
  apiURL = environment.apiUrl;
  myInputVariable: ElementRef;
  columns = [
    { name: 'Id', prop: 'bankMasterID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];
  ipAddress: any;
  editdata: any;
  editID: any;
  file: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  allcomp: any;
  companyID: any;
  childcompany: string;
  comp: any;
  adminRoot = environment.adminRoot;
  events: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.checkpermission();
    this.childcompany = localStorage.getItem('childcompany');
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: [+localStorage.getItem('company_id')],
      searchQuery: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.getcompany1();
    this.getTaskStages();
  }

  getTaskStages() {
    this.spinner.start('12');
    this.api
      .callApi(this.constant.GETALLTASKSTAGES, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('12');
        }
        this.spinner.stop('12');
      });
  }

  updateFilter(event): void {
    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.events = val;
      this.filterData.searchQuery = this.events;
    } else {
      this.filterData.searchQuery = this.events;
    }
    this.getTaskStages();
  }

  getData(id: any) {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBYIDTASKSTAGES + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editdata = res.data.TaskStage;
          this.companyID = res.data.companyMasterID;
          this.editID = id;
          this.spinner.stop();
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }

  onsubmit3() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getTaskStages();
  }

  onSubmit() {
    if (!this.addtaskstage.valid) {
      return;
    }

    let body = {
      TaskStage: this.addtaskstage.value.taskstage,
      companyMasterID: this.addtaskstage.value.company,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDTASKSTAGES, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.addtaskstage.resetForm();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.getTaskStages()
          }, 3000);
          this.spinner.stop();
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  onSubmit1() {
    if (!this.edittaskstage.valid) {
      return;
    }

    let body = {
      TaskStage: this.edittaskstage.value.taskstage,
      tasks_stagesID: this.editID,
      companyMasterID: this.edittaskstage.value.company,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATETASKSTAGES, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal1.nativeElement.click();

          this.edittaskstage.onReset();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.getTaskStages()
          }, 3000);
          this.spinner.stop();
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
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
              permissionval.formName == 'TaskStages' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TaskStages' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TaskStages' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TaskStages' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getTaskStages();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getTaskStages();
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/add_bank']);
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
          tasks_stagesID: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETETASKSTAGE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getTaskStages()
              this.spinner.stop();
            } else {
              this.notifications.create('Error', res.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            }
          },
          (err) => {
            this.notifications.create('Error', err.error.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          },
        );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Task stage will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          tasks_stagesID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.STATUSCHANGETASKSTAGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getTaskStages()
                this.spinner.stop();
              } else {
                this.notifications.create('Error', res.message, NotificationType.Error, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop();
              }
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
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
          tasks_stagesID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.STATUSCHANGETASKSTAGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getTaskStages()
              this.spinner.stop();
            },
            (err) => {
              this.spinner.stop();
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

  // import Expense
  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }
  getcompany1() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }

  downloadFile() {
    this.spinner.start('start');

    let mainbody: any = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };

    this.api
      .callApi(this.constant.GETALLTASKSTAGES, mainbody, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'TaskStages.xlsx');
    this.spinner.stop('start');
  }

  private handleError(err: string) {
    this.notifications.create('Error', err, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    this.datefilter.resetForm();
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: [+localStorage.getItem('company_id')],
      searchQuery: '',
    };
    this.getTaskStages();
  }

  importExcel() {
    this.router.navigate([this.adminRoot + '/tasks/import_task_stages/']);
  }
}
