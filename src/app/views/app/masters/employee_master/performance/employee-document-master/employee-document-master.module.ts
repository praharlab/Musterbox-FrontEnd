import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDocumentMasterRoutingModule } from './employee-document-master-routing.module';
import { EmployeeDocumentComponent } from './employee-document/employee-document.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [EmployeeDocumentComponent],
  imports: [
    CommonModule,
    EmployeeDocumentMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule
  ]
})
export class EmployeeDocumentMasterModule { }
