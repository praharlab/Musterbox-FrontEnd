import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortLeaveAppReportComponent } from './short-leave-app-report/short-leave-app-report.component';


const routes: Routes = [
  {path: '', component: ShortLeaveAppReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortLeaveApplicationReportRoutingModule { }
