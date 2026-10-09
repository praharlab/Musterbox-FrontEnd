import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoalSettingMasterRoutingModule } from './goal-setting-master-routing.module';
import { ListGoalSettingComponent } from './list-goal-setting/list-goal-setting.component';
import { AddGoalSettingComponent } from './add-goal-setting/add-goal-setting.component';
import { EditGoalSettingComponent } from './edit-goal-setting/edit-goal-setting.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListGoalSettingComponent, AddGoalSettingComponent, EditGoalSettingComponent],
  imports: [
    CommonModule,
    GoalSettingMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class GoalSettingMasterModule { }
