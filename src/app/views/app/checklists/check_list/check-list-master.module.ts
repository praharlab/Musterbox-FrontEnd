import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckListMasterRoutingModule } from './check-list-master-routing.module';
import { ListChecklistComponent } from './list-checklist/list-checklist.component';
import { AddChecklistComponent } from './add-checklist/add-checklist.component';
import { EditChecklistComponent } from './edit-checklist/edit-checklist.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListChecklistComponent, AddChecklistComponent, EditChecklistComponent],
  imports: [
    CommonModule,
    CheckListMasterRoutingModule,
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
export class CheckListMasterModule { }
