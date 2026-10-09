import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailTemplateTypeMasterRoutingModule } from './mail-template-type-master-routing.module';
import { ListMailTypeComponent } from './list-mail-type/list-mail-type.component';
import { EditMailTypeComponent } from './edit-mail-type/edit-mail-type.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { AddMailTypeComponent } from './add-mail-type/add-mail-type.component';


@NgModule({
  declarations: [ListMailTypeComponent, AddMailTypeComponent, EditMailTypeComponent],
  imports: [
    CommonModule,
    MailTemplateTypeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class MailTemplateTypeMasterModule { }
