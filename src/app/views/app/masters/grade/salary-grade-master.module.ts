import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryGradeMasterRoutingModule } from './salary-grade-master-routing.module';
import { ListGradeComponent } from './list-grade/list-grade.component';
import { AddGradeComponent } from './add-grade/add-grade.component';
import { EditGradeComponent } from './edit-grade/edit-grade.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';


@NgModule({
  declarations: [ListGradeComponent, AddGradeComponent, EditGradeComponent],
  imports: [
    CommonModule,
    SalaryGradeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule
  ]
})
export class SalaryGradeMasterModule { }
