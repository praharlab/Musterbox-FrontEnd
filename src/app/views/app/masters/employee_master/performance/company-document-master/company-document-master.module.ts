import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDocumentMasterRoutingModule } from './company-document-master-routing.module';
import { CompanyDocumentComponent } from './company-document/company-document.component';


@NgModule({
  declarations: [CompanyDocumentComponent],
  imports: [
    CommonModule,
    CompanyDocumentMasterRoutingModule
  ]
})
export class CompanyDocumentMasterModule { }
