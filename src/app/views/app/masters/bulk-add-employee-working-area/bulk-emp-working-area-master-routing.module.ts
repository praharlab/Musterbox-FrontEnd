import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmployeeWorkingAreaComponent } from './bulk-add-employee-working-area.component';


const routes: Routes = [
  { path: '', component: BulkAddEmployeeWorkingAreaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkEmpWorkingAreaMasterRoutingModule { }
