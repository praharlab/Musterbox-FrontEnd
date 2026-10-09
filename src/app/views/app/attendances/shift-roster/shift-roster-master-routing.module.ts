import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShiftRosterComponent } from './shift-roster.component';
import { ImportShiftRosterComponent } from '../import-shift-roster/import-shift-roster.component';


const routes: Routes = [
  { path: '', component: ShiftRosterComponent },
  { path: 'import_shiftRoster', component: ImportShiftRosterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftRosterMasterRoutingModule { }
