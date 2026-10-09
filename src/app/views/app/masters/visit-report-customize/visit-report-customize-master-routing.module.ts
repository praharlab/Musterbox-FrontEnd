import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitReportCustomizeComponent } from './visit-report-customize.component';


const routes: Routes = [
  { path: '', component: VisitReportCustomizeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitReportCustomizeMasterRoutingModule { }
