import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkillsetsReportComponent } from './skillsets-report.component';


const routes: Routes = [
  { path: '', component: SkillsetsReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsetsReportMasterRoutingModule { }
