import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeGoalMasterRoutingModule } from './employee-goal-master-routing.module';
import { ListEmployeeGoalComponent } from './list-employee-goal/list-employee-goal.component';
import { AddEmployeeGoalComponent } from './add-employee-goal/add-employee-goal.component';
import { EditEmployeeGoalComponent } from './edit-employee-goal/edit-employee-goal.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListEmployeeGoalComponent, AddEmployeeGoalComponent, EditEmployeeGoalComponent],
  imports: [
    CommonModule,
    EmployeeGoalMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    TranslateModule
  ]
})
export class EmployeeGoalMasterModule { }
