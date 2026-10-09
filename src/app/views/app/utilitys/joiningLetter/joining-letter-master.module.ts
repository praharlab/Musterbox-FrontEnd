import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoiningLetterMasterRoutingModule } from './joining-letter-master-routing.module';
import { ListJoiningLetterComponent } from './list-joining-letter/list-joining-letter.component';
import { AddJoiningLetterComponent } from './add-joining-letter/add-joining-letter.component';
import { EditJoiningLetterComponent } from './edit-joining-letter/edit-joining-letter.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListJoiningLetterComponent, AddJoiningLetterComponent, EditJoiningLetterComponent],
  imports: [
    CommonModule,
    JoiningLetterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    QuillModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ]
})
export class JoiningLetterMasterModule { }
