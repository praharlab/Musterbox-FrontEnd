import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LetterTemplateMasterRoutingModule } from './letter-template-master-routing.module';
import { ListLetterTemplatetypeComponent } from './list-letter-templatetype/list-letter-templatetype.component';
import { AddLetterTemplatetypeComponent } from './add-letter-templatetype/add-letter-templatetype.component';
import { EditLetterTemplatetypeComponent } from './edit-letter-templatetype/edit-letter-templatetype.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListLetterTemplatetypeComponent, AddLetterTemplatetypeComponent, EditLetterTemplatetypeComponent],
  imports: [
    CommonModule,
    LetterTemplateMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class LetterTemplateMasterModule { }
