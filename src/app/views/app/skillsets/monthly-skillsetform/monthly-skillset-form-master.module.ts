import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlySkillsetFormMasterRoutingModule } from './monthly-skillset-form-master-routing.module';
import { ListMonthlySkillsetformComponent } from './list-monthly-skillsetform/list-monthly-skillsetform.component';
import { AddMonthlySkillsetformComponent } from './add-monthly-skillsetform/add-monthly-skillsetform.component';
import { EditMonthlySkillsetformComponent } from './edit-monthly-skillsetform/edit-monthly-skillsetform.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListMonthlySkillsetformComponent, AddMonthlySkillsetformComponent, EditMonthlySkillsetformComponent],
  imports: [
    CommonModule,
    MonthlySkillsetFormMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ]
})
export class MonthlySkillsetFormMasterModule { }
