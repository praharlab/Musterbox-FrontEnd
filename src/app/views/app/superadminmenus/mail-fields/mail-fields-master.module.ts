import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailFieldsMasterRoutingModule } from './mail-fields-master-routing.module';
import { ListMailFieldsComponent } from './list-mail-fields/list-mail-fields.component';
import { AddMailFieldsComponent } from './add-mail-fields/add-mail-fields.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListMailFieldsComponent, AddMailFieldsComponent],
  imports: [
    CommonModule,
    MailFieldsMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class MailFieldsMasterModule { }
