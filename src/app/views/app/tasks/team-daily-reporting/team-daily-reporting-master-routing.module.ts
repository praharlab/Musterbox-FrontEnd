import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamDailyReportComponent } from './team-daily-reporting.component';


const routes: Routes = [
  { path: '', component: TeamDailyReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamDailyReportingMasterRoutingModule { }
