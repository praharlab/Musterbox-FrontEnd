import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddWorkingLocationComponent } from './bulk-add-working-location.component';


const routes: Routes = [
  { path: '', component: BulkAddWorkingLocationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkWorkLocationMasterRoutingModule { }
