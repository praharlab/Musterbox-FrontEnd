import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SentimentsReportComponent } from './sentiments-report.component';


const routes: Routes = [
  { path: '', component: SentimentsReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SentimentsReportMasterRoutingModule { }
