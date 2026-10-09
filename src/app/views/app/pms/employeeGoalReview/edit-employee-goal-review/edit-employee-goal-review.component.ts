import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-employee-goal-review',
    templateUrl: './edit-employee-goal-review.component.html',
    styleUrls: ['./edit-employee-goal-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeGoalReviewComponent implements OnInit {
  @ViewChild('addEmployeeGoalReview') addEmployeeGoalReview: NgForm;

  company_id: any;
  adminRoot = environment.adminRoot;
  comp: any = [];
  values: any = [];
  allReviewerBranch: any = [];
  employeegoal_Id: any;
  emlpoyeeGoalData: string;
  kpiData: any = [];
  employeeBranch: any = [];
  employeeCompany: any = [];
  employeeGoalReviewData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getEmployeeGoalReviewDetails();
  }

  getEmployeeGoalReviewDetails() {
    this.spinner.start('goal');
    this.api
      .callApi(
        this.constant.GETONEEMPLOYEEGOALREVIEW + this.activatedRoute.snapshot.params.id,
        {},
        'GET',
        false,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.employeeGoalReviewData = res.data;

          this.employeeGoalReviewData.employeeGoal.goalMasterId =
            +this.employeeGoalReviewData.employeeGoal.goalMasterId;

          this.emlpoyeeGoalData =
            String(this.employeeGoalReviewData.employeeGoal.goalAssignedTo.displayName) +
            '_' +
            String(this.employeeGoalReviewData.employeeGoal.goalMaster.title);

          this.selectcompany(
            this.employeeGoalReviewData.employeeGoal.goalMaster.companyMaster.companyMasterID,
          );

          this.spinner.stop('goal');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('goal');
        },
      );
  }

  selectcompany(id) {
    if (!id) {
      return;
    }

    this.values = [];
    this.allReviewerBranch = [];
    this.employeegoal_Id = '';

    this.getEmployee(id);
  }

  getcompany() {
    this.spinner.start('company');
    this.api
      .callApi(
        this.constant.GETALLCOMPANYBYID,
        {
          companyMasterID: localStorage.getItem('company_id'),
        },
        'POST',
        false,
        false,
        true,
      )
      .subscribe(
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

  onSubmit() {
    if (!this.addEmployeeGoalReview.valid) {
      return;
    }

    const body = {
      employeeGoalId: +this.employeeGoalReviewData.employeeGoalId,
      bulkData: [
        {
          id: +this.employeeGoalReviewData.id, // id of employeeGoalReview
          kpiMasterId: +this.employeeGoalReviewData.kpiMasterId,

          targetGiven: this.addEmployeeGoalReview.value.targetGiven,
          targetAchieved: this.addEmployeeGoalReview.value.targetAchieved,
          isCompleted: this.addEmployeeGoalReview.value.isCompleted,
          userMasterID: this.addEmployeeGoalReview.value.reviewer,
        },
      ],
    };

    if (this.addEmployeeGoalReview.value.remarks) {
      body.bulkData[0]['remarks'] = this.addEmployeeGoalReview.value.remarks;
    }

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.UPDATEEMPLOYEEGOALREVIEW, body, 'PUT', true, true, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/pms/goalReview']);
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

  getEmployee(selectedId) {
    if (!selectedId) return;
    this.employeeCompany = [];

    let bb = {
      page: '',
      limit: '',
      companyMasterID: selectedId,
    };
    this.spinner.start('employee');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employeeCompany = res.data;
          this.spinner.stop('employee');
        } else {
          this.spinner.stop('employee');
        }
      },
      (err) => {
        this.handleError(err.error.message);

        this.spinner.stop('employee');
      },
    );
  }

  selectEmployeeGoal(data) {
    if (data.length == 0) return (this.kpiData = []);

    this.kpiData = data.flatMap((e) => e.kraMaster.kpiMasters);

    this.kpiData.map((item) => {
      data.goalMaster.kraMasters.map((e) => {
        if (item.kraMasterId == e.id) {
          item['kraTitle'] = e.title;
        }
      });
    });
  }
}
