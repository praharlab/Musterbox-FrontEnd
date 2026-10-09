import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutdoorDutyApplicationReportComponent } from './outdoor-duty-application-report.component';


const routes: Routes = [
  { path: '', component: OutdoorDutyApplicationReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutdoorDutyApplicationReportMasterRoutingModule { }
