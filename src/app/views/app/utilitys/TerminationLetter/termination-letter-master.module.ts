import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminationLetterMasterRoutingModule } from './termination-letter-master-routing.module';
import { ListTerminationLetterComponent } from './list-termination-letter/list-termination-letter.component';
import { AddTerminationLetterComponent } from './add-termination-letter/add-termination-letter.component';
import { EditTerminationLetterComponent } from './edit-termination-letter/edit-termination-letter.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ListTerminationLetterComponent, AddTerminationLetterComponent, EditTerminationLetterComponent],
  imports: [
    CommonModule,
    TerminationLetterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    QuillModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ]
})
export class TerminationLetterMasterModule { }
