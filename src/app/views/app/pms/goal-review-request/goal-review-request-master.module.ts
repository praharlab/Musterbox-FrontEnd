import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoalReviewRequestMasterRoutingModule } from './goal-review-request-master-routing.module';
import { ListGoalReviewRequestComponent } from './list-goal-review-request/list-goal-review-request.component';
import { AddGoalReviewRequestComponent } from './add-goal-review-request/add-goal-review-request.component';
import { EditGoalReviewRequestComponent } from './edit-goal-review-request/edit-goal-review-request.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListGoalReviewRequestComponent, AddGoalReviewRequestComponent, EditGoalReviewRequestComponent],
  imports: [
    CommonModule,
    GoalReviewRequestMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ]
})
export class GoalReviewRequestMasterModule { }
