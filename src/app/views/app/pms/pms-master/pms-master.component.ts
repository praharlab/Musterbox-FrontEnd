import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-pms-master',
    templateUrl: './pms-master.component.html',
    styleUrls: ['./pms-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PmsMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  adminRoot = environment.adminRoot;
  PmsArray: any[];
  ReviewFormArray: any[];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.PmsArray = [
      {
        icon: 'simple-icon-grid',
        label: 'Pms Policy',
        menu: 'PMSPolicy',
        to: `${this.adminRoot}/pms/pmspolicy`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Goal Setting',
        menu: 'GoalSetting',
        to: `${this.adminRoot}/pms/goalsetting`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Goal',
        menu: 'Goal',
        to: `${this.adminRoot}/pms/goal`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Employee Goal',
        menu: 'AssignGoalToEmployee',
        to: `${this.adminRoot}/pms/empgoal`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Goal Review',
        menu: 'GoalReview',
        to: `${this.adminRoot}/pms/goalReview`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Goal Review Request',
        menu: 'GoalReviewRequest',
        to: `${this.adminRoot}/pms/goalReviewRequest`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Goal Review Report',
        menu: 'GoalReviewReport',
        to: `${this.adminRoot}/pms/goalReviewReport`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Designation Wise Goal Review Report',
        menu: 'DesignationWiseGoalReviewReport',
        to: `${this.adminRoot}/pms/designationWiseReport`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'KRA',
        menu: 'KRA',
        to: `${this.adminRoot}/pms/kra`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'KPI',
        menu: 'KPI',
        to: `${this.adminRoot}/pms/kpi`,
      },
    ];

    this.ReviewFormArray = [
      {
        icon: 'simple-icon-grid',
        label: 'Review Form',
        menu: 'ReviewForm',
        to: `${this.adminRoot}/pms/reviewform`,
      },

      {
        icon: 'simple-icon-grid',
        label: 'Performance Review',
        menu: 'PerformanceReview',
        to: `${this.adminRoot}/pms/performanceReview`,
      },

      {
        icon: 'simple-icon-grid',
        label: 'Set Performance Review',
        menu: 'SetPerformanceReview',
        to: `${this.adminRoot}/pms/setPerformanceReview`,
      },

      {
        icon: 'simple-icon-grid',
        label: 'Review Request',
        menu: 'ReviewRequest',
        to: `${this.adminRoot}/pms/reviewRequest`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Performance Review Report',
        menu: 'PerformanceReviewReport',
        to: `${this.adminRoot}/pms/performanceReviewReport`,
      },

    ];
  }
}
