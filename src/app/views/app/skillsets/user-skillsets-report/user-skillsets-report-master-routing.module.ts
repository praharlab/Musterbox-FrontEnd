import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSkillsetsReportComponent } from './user-skillsets-report.component';


const routes: Routes = [
  { path: '', component: UserSkillsetsReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSkillsetsReportMasterRoutingModule { }
