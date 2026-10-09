import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form21MasterRoutingModule } from './form21-master-routing.module';
import { Form21Component } from './form21.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [Form21Component],
  imports: [
    CommonModule,
    Form21MasterRoutingModule,
    PdfViewerModule
  ]
})
export class Form21MasterModule { }
