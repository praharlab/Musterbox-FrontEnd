import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDocumentComponent } from './employee-document/employee-document.component';


const routes: Routes = [
  { path: '', component: EmployeeDocumentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDocumentMasterRoutingModule { }
