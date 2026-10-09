import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncrementLetterMasterRoutingModule } from './increment-letter-master-routing.module';
import { ListIncrementLetterComponent } from './list-increment-letter/list-increment-letter.component';
import { EditIncrementLetterComponent } from './edit-increment-letter/edit-increment-letter.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AddIncrementLetterComponent } from './add-increment-letter/add-increment-letter.component';


@NgModule({
  declarations: [ListIncrementLetterComponent, AddIncrementLetterComponent, EditIncrementLetterComponent],
  imports: [
    CommonModule,
    IncrementLetterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    ModalModule,
    QuillModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ]
})
export class IncrementLetterMasterModule { }
