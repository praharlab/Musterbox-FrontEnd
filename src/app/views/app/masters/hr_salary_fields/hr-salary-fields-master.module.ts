import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrSalaryFieldsMasterRoutingModule } from './hr-salary-fields-master-routing.module';
import { ListHrSalaryFieldsComponent } from './list-hr-salary-fields/list-hr-salary-fields.component';
import { AddHrSalaryFieldsComponent } from './add-hr-salary-fields/add-hr-salary-fields.component';
import { EditHrSalaryFieldsComponent } from './edit-hr-salary-fields/edit-hr-salary-fields.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ListHrSalaryFieldsComponent, AddHrSalaryFieldsComponent, EditHrSalaryFieldsComponent],
  imports: [
    CommonModule,
    HrSalaryFieldsMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
  ]
})
export class HrSalaryFieldsMasterModule { }
