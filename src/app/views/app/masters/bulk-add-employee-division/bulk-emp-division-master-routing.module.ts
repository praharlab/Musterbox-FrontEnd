import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmployeeDivisionComponent } from './bulk-add-employee-division.component';


const routes: Routes = [
  { path: '', component: BulkAddEmployeeDivisionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkEmpDivisionMasterRoutingModule { }
