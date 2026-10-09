import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDeclarationReportComponent } from './employee-declaration-report.component';


const routes: Routes = [
  { path: '', component: EmployeeDeclarationReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDeclarationReportMasterRoutingModule { }
