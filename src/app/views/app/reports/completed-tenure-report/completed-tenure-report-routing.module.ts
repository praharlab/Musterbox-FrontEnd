import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompletedTenureReportComponent } from './completed-tenure-report.component';


const routes: Routes = [
    { path: '', component: CompletedTenureReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompletedTenureReportRoutingModule { }
