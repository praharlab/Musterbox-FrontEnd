import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeEducationRejectComponent } from './employee-education-reject/employee-education-reject.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeExperianceRejectComponent } from './employee-experiance-reject/employee-experiance-reject.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { EmployeeFamilyRejectComponent } from './employee-family-reject/employee-family-reject.component';
import { EmployeeDocumentRejectComponent } from './employee-document-reject/employee-document-reject.component';



@NgModule({
  declarations: [EmployeeEducationRejectComponent, EmployeeExperianceRejectComponent, EmployeeFamilyRejectComponent, EmployeeDocumentRejectComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
  ],
  exports: [
    EmployeeEducationRejectComponent,
    EmployeeExperianceRejectComponent,
    EmployeeFamilyRejectComponent,
    EmployeeDocumentRejectComponent,
  ]
})
export class RequestCommonModule { }
