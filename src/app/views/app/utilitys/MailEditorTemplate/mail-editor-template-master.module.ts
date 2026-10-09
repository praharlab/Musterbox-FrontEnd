import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailEditorTemplateMasterRoutingModule } from './mail-editor-template-master-routing.module';
import { MailTemplateListComponent } from './list-template/mail-template-list.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MailTemplateComponent } from './add-template/mail-template.component';
import { EditMailTemplateComponent } from './edit-mail-template/edit-mail-template.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [MailTemplateListComponent, MailTemplateComponent, EditMailTemplateComponent],
  imports: [
    CommonModule,
    MailEditorTemplateMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    QuillModule.forRoot(),
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class MailEditorTemplateMasterModule { }
