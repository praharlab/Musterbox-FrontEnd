import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsetFormMasterRoutingModule } from './skillset-form-master-routing.module';
import { ListSkillsetformComponent } from './list-skillsetform/list-skillsetform.component';
import { AddSkillsetformComponent } from './add-skillsetform/add-skillsetform.component';
import { EditSkillsetformComponent } from './edit-skillsetform/edit-skillsetform.component';
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
  declarations: [ListSkillsetformComponent, AddSkillsetformComponent, EditSkillsetformComponent],
  imports: [
    CommonModule,
    SkillsetFormMasterRoutingModule,
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
export class SkillsetFormMasterModule { }
