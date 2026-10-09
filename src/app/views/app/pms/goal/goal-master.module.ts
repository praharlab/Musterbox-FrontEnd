import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoalMasterRoutingModule } from './goal-master-routing.module';
import { ListGoalComponent } from './list-goal/list-goal.component';
import { AddGoalComponent } from './add-goal/add-goal.component';
import { EditGoalComponent } from './edit-goal/edit-goal.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [ListGoalComponent, AddGoalComponent, EditGoalComponent],
  imports: [
    CommonModule,
    GoalMasterRoutingModule,
    PagesContainersModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    BsDatepickerModule,
  ]
})
export class GoalMasterModule { }
