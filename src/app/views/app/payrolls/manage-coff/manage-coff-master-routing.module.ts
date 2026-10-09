import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCoffComponent } from './manage-coff.component';


const routes: Routes = [
  { path: '', component: ManageCoffComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCoffMasterRoutingModule { }
