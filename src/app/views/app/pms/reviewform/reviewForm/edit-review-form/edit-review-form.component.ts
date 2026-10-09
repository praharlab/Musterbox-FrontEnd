import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-review-form',
    templateUrl: './edit-review-form.component.html',
    styleUrls: ['./edit-review-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditReviewFormComponent implements OnInit {
  @ViewChild('addReviewForm') addReviewForm: NgForm;
  editData: any;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  adminRoot = environment.adminRoot;

  values: any = [];
  valuesCopy: any = [];
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');
    this.addReviewFormQuestionCategory();
    this.getcompany();
    this.editdata();
  }

  private editdata() {
    let id = this.formValue.ListReviewFormComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.GETONEREVIEWFORM + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data) {
          this.editData = res.data;
          this.values = res.data.reviewFormQuestionCategories;
          this.valuesCopy = res.data.reviewFormQuestionCategories.map((item) => {
            return {
              id: +item.id,
              title: item.title,
              description: item.description,
              reviewFormQuestions: item.reviewFormQuestions.map((question) => {
                return {
                  id: +question.id,
                  question: question.question,
                  description: question.description,
                  responseType: question.responseType,
                };
              }),
            };
          });
        }

        this.spinner.stop('start');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  addReviewFormQuestionCategory() {
    const unique_id = this.generateUniqueId();
    const newCategory = {
      unique_id: unique_id,
      title: '',
      description: '',
      reviewFormQuestions: [
        {
          question: '',
          description: '',
          responseType: '',
        },
      ],
    };
    this.values.push(newCategory);
  }

  addReviewFormQuestion(categoryIndex: number) {
    const newQuestion = {
      question: '',
      description: '',
      responseType: '',
    };
    this.values[categoryIndex].reviewFormQuestions.push(newQuestion);
  }

  removeReviewFormQuestion(categoryIndex: number, questionIndex: number) {
    if (this.values[categoryIndex].reviewFormQuestions.length > 1) {
      if (this.values[categoryIndex].reviewFormQuestions[questionIndex].hasOwnProperty('id')) {
        this.values[categoryIndex].reviewFormQuestions[questionIndex]['delete'] = true;
      } else {
        this.values[categoryIndex].reviewFormQuestions.splice(questionIndex, 1);
      }
    }
  }

  removeReviewFormQuestionCategory(category: any) {
    if (this.values.length > 1) {
      if (category.hasOwnProperty('id')) {
        this.values.map((item) => {
          if (item.id == category.id) {
            item['delete'] = true;
            item.reviewFormQuestions.map((question) => {
              question['delete'] = true;
            });
          }
        });
      } else {
        let newValues = this.values.filter((item) => item.id !== category.id);
        this.values = newValues;
      }
    }
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('start');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('start');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('start');
      },
    );
  }

  onSubmit() {
    if (!this.addReviewForm.valid) {
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.stop('start');

    this.values.map((item) => {
      let obj;
      if (item.id) {
        obj = {
          id: +item.id,
          title: item.title,
          description: item.description,
          delete: item.delete ? item.delete : false,
          reviewFormQuestions: item.reviewFormQuestions.map((question) => {
            let innerObj;
            if (question.id) {
              innerObj = {
                id: +question.id,
                question: question.question,
                description: question.description,
                responseType: question.responseType,
                delete: question.delete ? question.delete : false,
              };
            } else {
              innerObj = {
                question: question.question,
                description: question.description,
                responseType: question.responseType,
              };
            }
            return innerObj;
          }),
        };

        this.valuesCopy.push(obj);
      } else {
        obj = {
          title: item.title,
          description: item.description,
          reviewFormQuestions: item.reviewFormQuestions.map((question) => {
            return {
              question: question.question,
              description: question.description,
              responseType: question.responseType,
            };
          }),
        };

        this.valuesCopy.push(obj);
      }
    });

    let body = {
      title: this.addReviewForm.value.reviewFormTitle,
      description: this.addReviewForm.value.reviewFormDescription,
      companyMasterID: this.addReviewForm.value.companyMasterID,
      reviewFormQuestionCategory: this.valuesCopy,
    };


    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATEREVIEWFORM + this.formValue.ListReviewFormComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/pms/reviewform']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('start');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
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

  private generateUniqueId(): number {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
  }
}
