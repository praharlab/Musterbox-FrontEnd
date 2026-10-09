import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddmanualLeaveComponent } from './addmanual-leave.component';
import { ImportManualLeaveComponent } from '../import-manual-leave/import-manual-leave.component';


const routes: Routes = [
  { path: '', component: AddmanualLeaveComponent },
  { path: 'importmanual-leave', component: ImportManualLeaveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualLeaveMasterRoutingModule { }
