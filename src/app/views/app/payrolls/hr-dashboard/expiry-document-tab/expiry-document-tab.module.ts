import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpiryDocumentTabRoutingModule } from './expiry-document-tab-routing.module';
import { ExpiryDocumentTabComponent } from './expiry-document-tab.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ExpiryDocumentTabComponent],
  imports: [
    CommonModule,
    ExpiryDocumentTabRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class ExpiryDocumentTabModule { }
