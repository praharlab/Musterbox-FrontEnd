import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-goal-review-request',
    templateUrl: './edit-goal-review-request.component.html',
    styleUrls: ['./edit-goal-review-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditGoalReviewRequestComponent implements OnInit {
  @ViewChild('addEmployeeGoalReview') addEmployeeGoalReview: NgForm;

  company_id: any;
  adminRoot = environment.adminRoot;
  comp: any = [];
  values: any = [];
  allReviewerBranch: any = [];
  employeegoal_Id: any;
  emlpoyeeGoalReviewData: any = [];
  kpiData: any = [];
  branchFilter: boolean = false;
  employeeBranch: any = [];
  employeeCompany: any = [];
  employee: any = [];
  branch: string;
  employeeGoalReviewId: any;
  GoalName: any;
  show: boolean = false;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private formValueStorageService: FormValueStorageService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.employeeGoalReviewId = this.formValue.ListGoalReviewRequestComponent.id;
    this.getEmployeeGoalReviewData(this.employeeGoalReviewId);
  }

  onSubmit() {
    if (!this.addEmployeeGoalReview.valid) {
      return;
    }

    let kpiData = [];
    this.kpiData.map((value) => {
      const data = {
        kpiMasterId: +value.id,
        targetAchieved: +value.targetAchieved,
        remarks: value.remarks,
      };

      if (value.remarks) {
        data['remarks'] = value.remarks;
      }

      kpiData.push(data);
    });

    const body = {
      employeeGoalReviewId: +this.employeeGoalReviewId,
      kpiData,
    };


    this.spinner.start('submit');
    this.api.callApi(this.constant.ADDEMPLOYEEGOALREVIEW, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.notifications.create('Done', res.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: true,
        });

        setTimeout(() => {
          this.router.navigate([this.adminRoot + '/pms/goalReviewRequest']);
          this.spinner.stop('submit');
        }, 3000);
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit');
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


  getEmployeeGoalReviewData(id) {
    if (!id) return;
  
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETONEEMPLOYEEGOALREVIEW + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.emlpoyeeGoalReviewData = res.data;
          this.GoalName = this.emlpoyeeGoalReviewData.employeeGoal.goalMaster.title;
          
          // Flattening KPI data
          this.kpiData = this.emlpoyeeGoalReviewData.employeeGoal.goalMaster.kraMasters.flatMap(
            (e) => e.kpiMasters,
          );
  
          // Adding 'kraTitle' for each KPI from its corresponding KRA
          this.kpiData.map((item) => {
            this.emlpoyeeGoalReviewData.employeeGoal.goalMaster.kraMasters.map((e) => {
              if (item.kraMasterId == e.id) {
                item['kraTitle'] = e.title;
              }
            });
          });
  
          // Attach targetGiven and targetAchieved to the kpiData items from feedbacks
          this.kpiData.forEach((item) => {
            // Find the corresponding employeeGoalReviewFeedback for the kpiMasterId
            const feedback = this.emlpoyeeGoalReviewData.employeeGoalReviewFeedbacks.find(
              (feedback) => feedback.kpiMasterId === item.id
            );
  
            // Use the feedback's targetAchieved if it exists, otherwise use the employeeGoal's targetAchieved
            item['targetAchieved'] = feedback ? feedback.targetAchieved : this.emlpoyeeGoalReviewData.employeeGoal.targetAchieved;
  
            // Use the employeeGoal's targetGiven for all KPIs
            item['targetGiven'] = this.emlpoyeeGoalReviewData.employeeGoal.targetGiven;
          });
  
          this.show = true;
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        }
      );
  }
  

}
