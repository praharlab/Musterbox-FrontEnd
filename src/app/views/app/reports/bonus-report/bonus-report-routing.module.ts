import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BonusReportComponent } from './bonus-report.component';

const routes: Routes = [
  { path: '', component: BonusReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusReportRoutingModule { }
