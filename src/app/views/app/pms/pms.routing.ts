import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmsComponent } from './pms.component';
import { PmsMasterComponent } from './pms-master/pms-master.component';
import { VerifyPerformanceReviewAnswerComponent } from './verify-performance-review-answer/verify-performance-review-answer.component';
import { DesignationWiseGoalReviewReportComponent } from './designation-wise-goal-review-report/designation-wise-goal-review-report.component';


const routes: Routes = [
  {
    path: '',
    component: PmsComponent,
    children: [
      { path: '', redirectTo: 'pms_master', pathMatch: 'full' },

      { path: 'pms_master', component: PmsMasterComponent },

      { path: 'goal', loadChildren: () => import('./goal/goal-master.module').then((m) => m.GoalMasterModule) },

      { path: 'empgoal', loadChildren: () => import('./employeeGoal/employee-goal-master.module').then((m) => m.EmployeeGoalMasterModule) },

      { path: 'goalsetting', loadChildren: () => import('./goalSetting/goal-setting-master.module').then((m) => m.GoalSettingMasterModule) },

      { path: 'kra', loadChildren: () => import('./KRA/kramaster.module').then((m) => m.KRAMasterModule) },
      
      { path: 'kpi', loadChildren: () => import('./KPI/kpimaster.module').then((m) => m.KPIMasterModule) },

      { path: 'pmspolicy', loadChildren: () => import('./pmsPolicy/pms-policy-master.module').then((m) => m.PmsPolicyMasterModule) },

      {
        path: 'reviewform',
        loadChildren: () =>
          import('./reviewform/reviewform.module').then((m) => m.ReviewformModule),
      },

      {
        path: 'performanceReview',
        loadChildren: () =>
          import('./performance-review/performance-review.module').then(
            (m) => m.PerformanceReviewModule,
          ),
      },

      {
        path: 'setPerformanceReview',
        loadChildren: () =>
          import('./emloyee-performance-review/emloyee-performance-review.module').then(
            (m) => m.EmloyeePerformanceReviewModule,
          ),
      },

      { path: 'reviewRequest', loadChildren: () => import('./review-request/review-request-master.module').then((m) => m.ReviewRequestMasterModule) },

      { path: 'verifyPerformanceReviewAnswer', component: VerifyPerformanceReviewAnswerComponent },

      { path: 'performanceReviewReport', loadChildren: () => import('./performance-review-report/peformance-review-report-master.module').then((m) => m.PeformanceReviewReportMasterModule) },

      { path: 'goalReview', loadChildren: () => import('./employeeGoalReview/employee-goal-review-master.module').then((m) => m.EmployeeGoalReviewMasterModule) },

      { path: 'goalReviewRequest', loadChildren: () => import('./goal-review-request/goal-review-request-master.module').then((m) => m.GoalReviewRequestMasterModule) },

      { path: 'goalReviewReport', loadChildren: () => import('./goal-review-report/goal-review-report-master.module').then((m) => m.GoalReviewReportMasterModule) },

      { path: 'designationWiseReport', component: DesignationWiseGoalReviewReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmsRoutingModule { }
