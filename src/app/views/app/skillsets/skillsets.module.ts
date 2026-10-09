import { NgModule } from '@angular/core';
import { SkillsetsRoutingModule } from './skillsets.routing';

import { SkillsetsComponent } from './skillsets.component';
import { SkillsetsMasterComponent } from './skillsets-master/skillsets-master.component';
import { AddUserskillsetsFormComponent } from './add-userskillsets-form/add-userskillsets-form.component';
import { EditFieldskillsetsFormComponent } from './edit-fieldskillsets-form/edit-fieldskillsets-form.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SkillsetsComponent,
    SkillsetsMasterComponent,
    AddUserskillsetsFormComponent,
    EditFieldskillsetsFormComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    SkillsetsRoutingModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    PagesContainersModule,
    CollapseModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    NgSelectModule,
    TranslateModule
  ],
})
export class SkillsetsModule { }
