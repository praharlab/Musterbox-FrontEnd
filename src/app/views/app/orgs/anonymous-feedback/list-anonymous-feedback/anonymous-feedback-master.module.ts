import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnonymousFeedbackMasterRoutingModule } from './anonymous-feedback-master-routing.module';
import { ListAnonymousFeedbackComponent } from './list-anonymous-feedback.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListAnonymousFeedbackComponent],
  imports: [
    CommonModule,
    AnonymousFeedbackMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class AnonymousFeedbackMasterModule { }
