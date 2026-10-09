import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeIncentiveMasterRoutingModule } from './employee-incentive-master-routing.module';
import { ListEmployeeincentiveComponent } from './list-employeeincentive/list-employeeincentive.component';
import { AddEmployeeincentiveComponent } from './add-employeeincentive/add-employeeincentive.component';
import { EditEmployeeincentiveComponent } from './edit-employeeincentive/edit-employeeincentive.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListEmployeeincentiveComponent, AddEmployeeincentiveComponent, EditEmployeeincentiveComponent],
  imports: [
    CommonModule,
    EmployeeIncentiveMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    CommonFilterModule
  ]
})
export class EmployeeIncentiveMasterModule { }
