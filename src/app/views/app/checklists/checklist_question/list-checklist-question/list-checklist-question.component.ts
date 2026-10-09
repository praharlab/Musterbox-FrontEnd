import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-checklist-question',
    templateUrl: './list-checklist-question.component.html',
    styleUrls: ['./list-checklist-question.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListChecklistQuestionComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') modal: any;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  myInputVariable: ElementRef;

  columns = [
    { name: 'Id', prop: 'KPIID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['checkListQuestionID', 'checkListQuestion', 'checkListID', 'Status'];
  SelectionType = SelectionType;
  tabledata = ['checkListQuestionID', 'checkListQuestion', 'checkListID', 'Status'];
  scrollBarHorizontal = window.innerWidth < 1201;

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    searchQuery: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  product: any = [];
  usertype: any;
  company_id: any;
  checkListQuestionID: any;
  rows1: any = [];
  permissioncreate: any = [];
  permissionedit = [];
  permissionview: any = [];
  permissiondelete = [];
  file: any;
  comp: any;
  exp: any;
  childcompany: string;
  ipAddress: any;
  selectedCompany: number = null;
  checkListID: any;
  company1: any;
  events: string;
  limit = 10;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      searchQuery: '',
    };

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.usertype = localStorage.getItem('usertype');
    this.checkListQuestionID = localStorage.getItem('checkListQuestionID');
    this.checkpermission();
    this.getAllCheckListQuestionData();
  }

  getAllCheckListQuestionData() {
    this.spinner.start('main');
    this.api
      .callApi(
        this.constant.GETALLCHECKLISTQUESTIONDATA,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
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
              permissionval.formName == 'CheckListQuestion' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CheckListQuestion' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CheckListQuestion' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CheckListQuestion' &&
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
        this.getAllCheckListQuestionData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAllCheckListQuestionData();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getAllCheckListQuestionData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllCheckListQuestionData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/checklists/checklistQuestion/add_checklistQuestion']);
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
          checkListQuestionID: id,
          status: '2',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLISTQUESTION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getAllCheckListQuestionData();
                this.spinner.stop();
              } else {
                this.notifications.create(
                  'Error',
                  'You cannot delete this checklist question because it is filled by an employee',
                  NotificationType.Error,
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
          checkListQuestionID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLISTQUESTION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.getAllCheckListQuestionData();
                this.spinner.stop();
              } else {
                this.notifications.create(
                  'Error',
                  'You cannot deactive this checklist question because it is filled by an employee',
                  NotificationType.Error,
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
      text: 'CheckList will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          checkListQuestionID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.CHANGESTATUSCHECKLISTQUESTION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getAllCheckListQuestionData();
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
