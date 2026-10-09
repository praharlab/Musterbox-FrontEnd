import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OvertimeReportComponent } from './overtime-report.component';


const routes: Routes = [
  { path: '', component: OvertimeReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeReportMasterRoutingModule { }
