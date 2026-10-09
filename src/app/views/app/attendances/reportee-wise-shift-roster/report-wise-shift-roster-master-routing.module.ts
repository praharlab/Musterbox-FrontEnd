import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteeWiseShiftRosterComponent } from '../reportee-wise-shift-roster/reportee-wise-shift-roster.component';
import { ImportReporteeWiseShiftRosterComponent } from '../import-reportee-wise-shift-roster/import-reportee-wise-shift-roster.component';


const routes: Routes = [
  { path: '', component: ReporteeWiseShiftRosterComponent },
  { path: 'import_reporteeWiseShiftRoster', component: ImportReporteeWiseShiftRosterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportWiseShiftRosterMasterRoutingModule { }
