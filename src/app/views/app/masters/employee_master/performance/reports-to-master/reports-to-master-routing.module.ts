import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsToComponent } from './reports-to/reports-to.component';


const routes: Routes = [
  { path: '', component: ReportsToComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsToMasterRoutingModule { }
