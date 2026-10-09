import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LetterFieldsMasterRoutingModule } from './letter-fields-master-routing.module';
import { ListLetterFieldsComponent } from './list-letter-fields/list-letter-fields.component';
import { AddLetterFieldsComponent } from './add-letter-fields/add-letter-fields.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListLetterFieldsComponent, AddLetterFieldsComponent],
  imports: [
    CommonModule,
    LetterFieldsMasterRoutingModule,
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
export class LetterFieldsMasterModule { }
