import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmployeeProjectComponent } from './bulk-add-employee-project.component';


const routes: Routes = [
  { path: '', component: BulkAddEmployeeProjectComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkAddEmployeeProjectRoutingModule { }
