import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSkillsetsFormMasterRoutingModule } from './user-skillsets-form-master-routing.module';
import { UserSkillsetsFormComponent } from './user-skillsets-form.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [UserSkillsetsFormComponent],
  imports: [
    CommonModule,
    UserSkillsetsFormMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class UserSkillsetsFormMasterModule { }
