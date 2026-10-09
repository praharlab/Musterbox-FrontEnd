import { Component, OnInit, QueryList, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-verify-performance-review-answer',
    templateUrl: './verify-performance-review-answer.component.html',
    styleUrls: ['./verify-performance-review-answer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VerifyPerformanceReviewAnswerComponent implements OnInit {
  @ViewChildren('groupForm') groupForms: QueryList<any>;

  accordionGroups: any = [];
  adminRoot = environment.adminRoot;
  employeePerformanceReviewId: any;
  saveAsDraftDisabled: boolean = false;
  saveAsDraftState: string = '';
  finalSubmitDisabled: boolean = false;
  finalSubmitState: string = '';
  AnswerData: any = [];
  performanceReviewId: any;

  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    this.getReviewFormData();
  }

  getReviewFormData() {
    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.GETONEEMPLOYEEPERFORMANCEREVIEW + this.formValue.ReviewRequestComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.employeePerformanceReviewId = res.data.id;
          this.performanceReviewId = res.data.performanceReviewId;
          res.data.performanceReview.reviewForm.reviewFormQuestionCategories.map((dataItem) => {
            let obj = { formQuestions: [] };
            obj['heading'] = dataItem.title;
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

          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  onSaveAsDraftSubmit() {
    this.spinner.start('answer');
    this.saveAsDraftDisabled = true;
    this.saveAsDraftState = 'show-spinner';
    let answer = [];
    this.groupForms.forEach((form) => {
      if (form.valid) {
        answer.push({ id: form.__ngContext__[28], formvalue: form.value });
      }
    });

    let final = [];

    answer.forEach((answerItem) => {
      for (const key in answerItem.formvalue) {
        if (Object.hasOwnProperty.call(answerItem.formvalue, key)) {
          const [type, id] = key.split('#');
          const questionItem = this.accordionGroups.find((group) =>
            group.formQuestions.some(
              (question) => Number(question.reviewFormQuestionId) === Number(id),
            ),
          );

          if (questionItem) {
            const subquestionItem = questionItem.formQuestions.find(
              (subq) => Number(subq.reviewFormQuestionId) === Number(id),
            );

            if (subquestionItem) {
              switch (type) {
                case 'ratingAndText_RateValue':
                  let answerObject = {
                    id: subquestionItem.id,
                    employeePerformanceReviewId: +this.employeePerformanceReviewId,
                    reviewFormQuestionId: Number(id),
                  };

                  if (answerItem.formvalue[key]) {
                    answerObject['rating'] = answerItem.formvalue[key];
                  }
                  if (answerItem.formvalue[`ratingAndText_TextValue#${id}`]) {
                    answerObject['text'] = answerItem.formvalue[`ratingAndText_TextValue#${id}`];
                  }

                  final.push(answerObject);
                  break;

                case 'gradeAndText_GradeValue':
                  let answerObject2 = {
                    id: subquestionItem.id,
                    employeePerformanceReviewId: +this.employeePerformanceReviewId,
                    reviewFormQuestionId: Number(id),
                  };

                  if (answerItem.formvalue[key]) {
                    answerObject2['grade'] = answerItem.formvalue[key];
                  }
                  if (answerItem.formvalue[`gradeAndText_TextValue#${id}`]) {
                    answerObject2['text'] = answerItem.formvalue[`gradeAndText_TextValue#${id}`];
                  }

                  final.push(answerObject2);
                  break;

                case 'text':
                  let answerObject3 = {
                    id: subquestionItem.id,
                    employeePerformanceReviewId: +this.employeePerformanceReviewId,
                    reviewFormQuestionId: Number(id),
                  };

                  if (answerItem.formvalue[key]) {
                    answerObject3['text'] = answerItem.formvalue[key];
                  }

                  final.push(answerObject3);
                  break;

                case 'rating':
                  let answerObject4 = {
                    id: subquestionItem.id,
                    employeePerformanceReviewId: +this.employeePerformanceReviewId,
                    reviewFormQuestionId: Number(id),
                  };

                  if (answerItem.formvalue[key]) {
                    answerObject4['rating'] = answerItem.formvalue[key];
                  }

                  final.push(answerObject4);
                  break;

                case 'grade':
                  let answerObject5 = {
                    id: subquestionItem.id,
                    employeePerformanceReviewId: +this.employeePerformanceReviewId,
                    reviewFormQuestionId: Number(id),
                  };

                  if (answerItem.formvalue[key]) {
                    answerObject5['grade'] = answerItem.formvalue[key];
                  }

                  final.push(answerObject5);
                  break;

                default:
                  break;
              }
            }
          }
        }
      }
    });

    let create_answer = final.filter((e) => !e.id && (e.text || e.rating || e.grade));
    let update_answer = final.filter((e) => e.id);

    let body = [...create_answer, ...update_answer];

    this.api
      .callApi(this.constant.CREATEUPDATEREVIEWFORMANSWERS, body, 'POST', false, false, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/pms/reviewRequest']);
            this.saveAsDraftDisabled = false;
            this.saveAsDraftState = '';
            this.spinner.stop('answer');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('answer');
        },
      );
  }

  onFinalSubmit() {
    this.completdForm();
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  completdForm() {
    const body = {
      reviewerId: localStorage.getItem('id'),
      performanceReviewId: this.performanceReviewId,
      isCompleted: true,
    };

    this.finalSubmitDisabled = true;
    this.finalSubmitState = 'show-spinner';
    this.spinner.start('start1');
    this.api
      .callApi(
        this.constant.UPDATEEMPLOYEEPERFORMANCEREVIEW + this.formValue.ReviewRequestComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.onSaveAsDraftSubmit();
          setTimeout(() => {
            // this.router.navigate([this.adminRoot + '/pms/reviewRequest']);
            this.finalSubmitDisabled = false;
            this.finalSubmitState = '';
            this.spinner.stop('start1');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start1');
        },
      );
  }
}
