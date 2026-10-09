import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResignationReasonMasterRoutingModule } from './resignation-reason-master-routing.module';
import { ListResignationReasonComponent } from './list-resignation-reason/list-resignation-reason.component';
import { AddResignationReasonComponent } from './add-resignation-reason/add-resignation-reason.component';
import { EditResignationReasonComponent } from './edit-resignation-reason/edit-resignation-reason.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListResignationReasonComponent, AddResignationReasonComponent, EditResignationReasonComponent],
  imports: [
    CommonModule,
    ResignationReasonMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    TranslateModule
  ]
})
export class ResignationReasonMasterModule { }
