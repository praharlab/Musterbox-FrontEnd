import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OvertimeReportUserwiseComponent } from './overtime-report-userwise.component';


const routes: Routes = [
  { path: '', component: OvertimeReportUserwiseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OvertimeReportUserwiseMasterRoutingModule { }
