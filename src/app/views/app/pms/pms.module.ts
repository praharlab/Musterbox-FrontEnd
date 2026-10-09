import { NgModule } from '@angular/core';
import { PmsRoutingModule } from './pms.routing';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { PmsComponent } from './pms.component';
import { PmsMasterComponent } from './pms-master/pms-master.component';
import { VerifyPerformanceReviewAnswerComponent } from './verify-performance-review-answer/verify-performance-review-answer.component';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { DesignationWiseGoalReviewReportComponent } from './designation-wise-goal-review-report/designation-wise-goal-review-report.component';

@NgModule({
  declarations: [
    PmsComponent,
    PmsMasterComponent,
    VerifyPerformanceReviewAnswerComponent,
    DesignationWiseGoalReviewReportComponent,

  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    NgMultiSelectDropDownModule.forRoot(),
    PmsRoutingModule,
    ModalModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    NgxDatatableModule,
    PagesContainersModule,
    CollapseModule,
    PaginationModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
    BootstrapModule,
  ],
})
export class PmsModule { }
