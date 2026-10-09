import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpiryJoiningDocumentTabRoutingModule } from './expiry-joining-document-tab-routing.module';
import { ExpiryJoiningDocumentTabComponent } from './expiry-joining-document-tab.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ExpiryJoiningDocumentTabComponent],
  imports: [
    CommonModule,
    ExpiryJoiningDocumentTabRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class ExpiryJoiningDocumentTabModule { }
