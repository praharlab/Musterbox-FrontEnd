import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-employee-goal-review',
    templateUrl: './list-employee-goal-review.component.html',
    styleUrls: ['./list-employee-goal-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeGoalReviewComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp: any = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  Order = { label: 'Title', value: 'title' };

  changeOrderBy = [{ label: 'Title', value: 'title' }];

  body = {
    page: 1,
    limit: 10,
    company_id: Number(localStorage.getItem('company_id')),
    performanceReviewId: '',
    sortByField: '',
    sortByValue: 'ASC',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  selectedValue: string;
  query: string;
  comp: any;
  modalData: any = [];
  selectedCompany_id: any;
  performanceReviewData: any = [];

  AnswerData: any = [];
  modalDataTitle: any;

  accordionGroups: any = [];
  flag: boolean = false;
  kpiData: any = [];
  GoalName: string = '';

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {}

  ngOnInit() {
    this.selectedCompany_id = +localStorage.getItem('company_id');
    this.body = {
      page: 1,
      limit: 10,
      company_id: Number(localStorage.getItem('company_id')),
      performanceReviewId: '',
      sortByField: '',
      sortByValue: 'ASC',
    };

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
    this.getEmployeeGoalReviewData();
    this.getcompany();
  }

  getEmployeeGoalReviewData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}`;
    if (this.body.company_id) {
      queryString += `&companyMasterID=${this.body.company_id}`;
    }
    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }
    this.query = queryString;
    this.api
      .callApi(this.constant.GETALLEMPLOYEEGOALREVIEW + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  checkpermission() {
    this.spinner.start('permission');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api.callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GoalReview' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GoalReview' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GoalReview' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GoalReview' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('permission');
      },
    );
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getEmployeeGoalReviewData();
  }



  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }
    this.body.page = 1;
    this.body.company_id = this.companyfilter.value.companyMasterID;
    this.body.performanceReviewId = this.companyfilter.value.performanceReviewID;

    this.getEmployeeGoalReviewData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getEmployeeGoalReviewData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getEmployeeGoalReviewData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/pms/goalReview/add_goalReview']);
  }

  alertConfirmation(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEEMPLOYEEGOALREVIEW + data.id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              this.getEmployeeGoalReviewData();

              this.notifications.create('Done', res.message, NotificationType.Success, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('delete');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  clear() {
    this.companyfilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  getcompany() {
    this.spinner.start('company');

    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', false, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEGOALREVIEW +
          this.query +
          `&exportFileType=${this.selectedValue}&exportData=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'Employee Goal Review.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'Employee Goal Review.xlsx');
            this.selectedValue = null;
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.selectedValue = null;
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
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

  selectEmployeeGoal(data) {
    if (!data) return (this.kpiData = []);

    this.GoalName = data.employeeGoal.goalMaster.title;
    this.kpiData = data.employeeGoal.goalMaster.kraMasters.flatMap((e) => e.kpiMasters);

    this.kpiData.map((item) => {
      data.employeeGoal.goalMaster.kraMasters.map((e) => {
        if (item.kraMasterId == e.id) {
          item['kraTitle'] = e.title;
        }
      });
    });

    this.kpiData.map((item) => {
      data.employeeGoalReviewFeedbacks.map((e) => {
        if (item.id == e.kpiMasterId) {
          item['targetAchieved'] = e.targetAchieved;
        }
      });
    });
    

    // Adding targetGiven to each KPI object in the kpiData array
    this.kpiData.forEach((item) => {
      item['targetGiven'] = data.employeeGoal.targetGiven; // Adding Target Given from employeeGoal
    });

  }
}
