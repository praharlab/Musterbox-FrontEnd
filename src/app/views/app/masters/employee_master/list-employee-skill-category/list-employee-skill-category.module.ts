import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListEmployeeSkillCategoryRoutingModule } from './list-employee-skill-category-routing.module';
import { ListEmployeeSkillCategoryComponent } from './list-employee-skill-category.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListEmployeeSkillCategoryComponent],
  imports: [
    CommonModule,
    ListEmployeeSkillCategoryRoutingModule,
     FormsModule,
     NgSelectModule,
     TranslateModule,
     SimpleNotificationsModule.forRoot(),
     NgxUiLoaderModule,
     ModalModule
  ]
})
export class ListEmployeeSkillCategoryModule { }
