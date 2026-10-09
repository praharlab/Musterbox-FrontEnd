import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewVisitReportMasterComponent } from './view-visit-report-master/view-visit-report-master.component';
import { AddVisitReportMasterComponent } from './add-visit-report-master/add-visit-report-master.component';
import { EditVisitReportMasterComponent } from './edit-visit-report-master/edit-visit-report-master.component';


const routes: Routes = [
  { path: '', component: ViewVisitReportMasterComponent },
  { path: 'add_visit_report_master', component: AddVisitReportMasterComponent },
  { path: 'edit_visit_report_master', component: EditVisitReportMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitReportMasterRoutingModule { }
