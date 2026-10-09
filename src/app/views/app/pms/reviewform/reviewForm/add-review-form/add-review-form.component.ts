import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-review-form',
    templateUrl: './add-review-form.component.html',
    styleUrls: ['./add-review-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddReviewFormComponent implements OnInit {
  @ViewChild('addReviewForm') addReviewForm: NgForm;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  values: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.addReviewFormQuestionCategory();
  }

  addReviewFormQuestionCategory() {
    const unique_id = this.generateUniqueId();
    const newCategory = {
      unique_id: unique_id,
      title: '',
      description: '',
      reviewFormQuestions: [{ question: '', description: '', responseType: '' }],
    };
    this.values.push(newCategory);
  }

  addReviewFormQuestion(categoryIndex: number) {
    const newQuestion = { question: '', description: '', responseType: '' };
    this.values[categoryIndex].reviewFormQuestions.push(newQuestion);
  }

  removeReviewFormQuestion(categoryIndex: number, questionIndex: number) {
    this.values[categoryIndex].reviewFormQuestions.splice(questionIndex, 1);
  }

  removeReviewFormQuestionCategory(category: any) {
    const newValues = this.values.findIndex(obj => obj.unique_id == category.unique_id);
    if (newValues !== -1) {
      this.values.splice(newValues, 1);
    }
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('a');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('a');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('a');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('a');
      },
    );
  }

  onSubmit() {
    if (!this.addReviewForm.valid) {
      return;
    }

    this.values.map((item) => delete item['unique_id']);

    let body = {
      title: this.addReviewForm.value.reviewFormTitle,
      description: this.addReviewForm.value.reviewFormDescription,
      companyMasterID: this.addReviewForm.value.companyMasterID,
      reviewFormQuestionCategory: this.values,
    };

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATEREVIEWFORM, body, 'POST', true, true, true).subscribe(
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
