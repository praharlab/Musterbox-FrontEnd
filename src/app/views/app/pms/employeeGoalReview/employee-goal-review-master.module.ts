import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeGoalReviewMasterRoutingModule } from './employee-goal-review-master-routing.module';
import { ListEmployeeGoalReviewComponent } from './list-employee-goal-review/list-employee-goal-review.component';
import { AddEmployeeGoalReviewComponent } from './add-employee-goal-review/add-employee-goal-review.component';
import { EditEmployeeGoalReviewComponent } from './edit-employee-goal-review/edit-employee-goal-review.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [ListEmployeeGoalReviewComponent, AddEmployeeGoalReviewComponent, EditEmployeeGoalReviewComponent],
  imports: [
    CommonModule,
    EmployeeGoalReviewMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ]
})
export class EmployeeGoalReviewMasterModule { }
