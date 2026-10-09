import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-review-request',
    templateUrl: './review-request.component.html',
    styleUrls: ['./review-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReviewRequestComponent implements OnInit {
  @ViewChild('formfilter') formfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp: any = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  Order = { label: 'Reviewer', value: 'reviewerId' };

  changeOrderBy = [
    { label: 'Reviewer', value: 'reviewerId' },
    { label: 'Reviewee', value: 'revieweeId' },
  ];

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    performanceReviewId: '',
    reviewerId: Number(localStorage.getItem('id')),
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
  performaceReviewData: any;
  selectedCompany_id: any;
  AnswerData: any = [];
  modalDataTitle: any;
  accordionGroups: any = [];
  flag: boolean = false;
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
        const protectedRoutes = [this.adminRoot + '/pms/reviewRequest', this.adminRoot + '/pms/verifyPerformanceReviewAnswer'];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ReviewRequestComponent', false);
        }
      }
    });
   }

  ngOnInit() {
    this.selectedCompany_id = +localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ReviewRequestComponent')) {
      this.body = {
        page: 1,
        limit: 10,
        searchQuery: '',
        performanceReviewId: '',
        reviewerId: Number(localStorage.getItem('id')),
        sortByField: '',
        sortByValue: 'ASC',
      };
    } else {
      this.body = this.formValue.ReviewRequestComponent.body;
      this.body.sortByField = '';
      this.body.sortByValue = 'ASC';
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getPerformanceReview();
    this.checkpermission();
    this.getPeroformanceReviewData();
  }

  getPerformanceReview() {
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETALLPERFORMANCEREVIEW + `?companyMasterID=${this.selectedCompany_id}`,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.performaceReviewData = res.data;
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  getPeroformanceReviewData() {
    this.spinner.start('start1');
    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}`;
    if (this.body.performanceReviewId) {
      queryString += `&performanceReviewId=${this.body.performanceReviewId}`;
    }
    if (this.body.reviewerId) {
      queryString += `&userMasterID=${this.body.reviewerId}`;
    }
    if (this.body.searchQuery) {
      queryString += `&search=${this.body.searchQuery}`;
    }
    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }
    this.query = queryString;
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEPERFORMANCEREVIEW + queryString,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop('start1');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start1');
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ReviewRequest' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ReviewRequest' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getPeroformanceReviewData();
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    this.body.page = 1;
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getPeroformanceReviewData();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getPeroformanceReviewData();
    }
  }


  onSubmit() {
    if (!this.formfilter.valid) {
      return;
    }
    this.body.page = 1;
    this.body.performanceReviewId = this.formfilter.value.reviewID;
    this.getPeroformanceReviewData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getPeroformanceReviewData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getPeroformanceReviewData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.formfilter.resetForm();
    this.formValueStorageService.removeData('ReviewRequestComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEPERFORMANCEREVIEW +
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
            saveAs(blob, 'Review Form.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'Review Form.xlsx');
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

  getReviewFormData(rowData: any) {
    this.accordionGroups = [];
    this.modalDataTitle = '';
    this.modalDataTitle = rowData.reviewee.displayName;

    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETONEEMPLOYEEPERFORMANCEREVIEW + rowData.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          res.data.performanceReview.reviewForm.reviewFormQuestionCategories.map((dataItem) => {
            let obj = { formQuestions: [] };
            obj['heading'] = dataItem.title;
            obj['descr'] = dataItem.descr;
            obj['reviewFormQuestionCategorieId'] = dataItem.id;
            obj['formAnswer'] = [];
            obj['isOpen'] = true;
            dataItem.reviewFormQuestions.map((question) => {
              let q = {};
              q['reviewFormQuestionId'] = question.id;
              q['question'] = question.question;
              q['responseType'] = question.responseType;

              if (question.reviewFormAnswers.length > 0) {
                question.reviewFormAnswers.map((answer) => {
                  q['id'] = answer.id;
                  q['anstext'] = answer.text;
                  q['ansrating'] = answer.rating;
                  q['ansgrade'] = answer.grade;
                });
              }
              obj.formQuestions.push(q);
            });

            this.accordionGroups.push(obj);
          });

          this.spinner.stop('data');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ReviewRequestComponent',
      this.body,
      '/pms/verifyPerformanceReviewAnswer',
      rowData.id,
    );
  }

}
