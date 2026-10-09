import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckListQuestionMasterRoutingModule } from './check-list-question-master-routing.module';
import { ListChecklistQuestionComponent } from './list-checklist-question/list-checklist-question.component';
import { AddChecklistQuestionComponent } from './add-checklist-question/add-checklist-question.component';
import { EditChecklistQuestionComponent } from './edit-checklist-question/edit-checklist-question.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListChecklistQuestionComponent, AddChecklistQuestionComponent, EditChecklistQuestionComponent],
  imports: [
    CommonModule,
    CheckListQuestionMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule
  ]
})
export class CheckListQuestionMasterModule { }
