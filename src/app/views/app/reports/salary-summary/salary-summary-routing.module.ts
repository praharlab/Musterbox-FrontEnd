import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalarySummaryComponent } from './salary-summary.component';


const routes: Routes = [
  { path: '', component: SalarySummaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalarySummaryRoutingModule { }
