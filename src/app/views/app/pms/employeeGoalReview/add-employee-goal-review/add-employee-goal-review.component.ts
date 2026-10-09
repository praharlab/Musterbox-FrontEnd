import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-employee-goal-review',
    templateUrl: './add-employee-goal-review.component.html',
    styleUrls: ['./add-employee-goal-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeGoalReviewComponent implements OnInit {
  @ViewChild('addEmployeeGoalReview') addEmployeeGoalReview: NgForm;

  company_id: any;
  adminRoot = environment.adminRoot;
  comp: any = [];
  values: any = [];
  allReviewerBranch: any = [];
  employeegoal_Id: any;
  emlpoyeeGoalData: any = [];
  kpiData: any = [];
  branchFilter: boolean = false;
  employeeBranch: any = [];
  employeeCompany: any = [];
  employee: any = [];
  branch: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');

    this.getcompany();
    this.selectcompany(this.company_id);
  }

  selectcompany(id) {
    if (!id) {
      this.employee = [];
      this.branch = '';
      this.kpiData = [];
      return;
    }

    this.employee = [];
    this.branch = '';
    this.values = [];
    this.allReviewerBranch = [];
    this.employeegoal_Id = '';
    this.kpiData = [];

    this.getBranch(id);
    this.getEmployeeGoalData(id);
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
      employeeGoalId: +this.addEmployeeGoalReview.value.employeeGoalID.id,
      userMasterID: this.addEmployeeGoalReview.value.reviewer,
    };

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.CREATEEMPLOYEEGOALREVIEW, body, 'POST', true, true, true)
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

  getEmployeeGoalData(selectedId) {
    if (!selectedId) return;

    this.spinner.start('start');
    let queryString = `?companyMasterID=${selectedId}`;

    this.api
      .callApi(this.constant.GETALLEMPLOYEEGOAL + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.emlpoyeeGoalData = res.data;
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  getEmployee(selectedId) {
    if (!selectedId) return;
    this.employeeCompany = [];

    let bb = {
      page: '',
      limit: '',
      companyMasterID: selectedId,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeeCompany = res.data;
        }
      });
  }

  getBranch(selectedId) {
    if (!selectedId) return;

    this.spinner.start('getBranch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + selectedId, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.allReviewerBranch = res;
          this.spinner.stop('getBranch');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('getBranch');
        },
      );
  }

  selectReviewerBranch(id: any) {
    if (!id) {
      this.employee = [];
      return;
    }

    this.branchFilter = true;
    let bb = {
      branchMasterID: id,
    };

    this.employee = [];
    this.employeeBranch = [];
    this.spinner.start('branch1');
    this.api.callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.employeeBranch = res.data;
          this.spinner.stop('branch1');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('branch1');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('branch1');
      },
    );
  }

  selectEmployeeGoal(data) {
    if (!data) return (this.kpiData = []);

    this.kpiData = data.goalMaster.kraMasters.flatMap((e) => e.kpiMasters);

    this.kpiData.map((item) => {

      item['targetGiven'] = data.targetGiven; // Get targetGiven from employeeGoal


      data.goalMaster.kraMasters.map((e) => {
        if (item.kraMasterId == e.id) {
          item['kraTitle'] = e.title;
        }
      });
    });
  }
}
