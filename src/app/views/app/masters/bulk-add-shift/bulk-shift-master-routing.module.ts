import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddShiftComponent } from './bulk-add-shift.component';


const routes: Routes = [
  { path: '', component: BulkAddShiftComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkShiftMasterRoutingModule { }
