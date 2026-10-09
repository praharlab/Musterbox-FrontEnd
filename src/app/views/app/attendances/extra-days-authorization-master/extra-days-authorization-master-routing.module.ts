import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtraDaysAUthorizationMasterComponent } from './extra-days-authorization-master.component';


const routes: Routes = [
  { path: '', component: ExtraDaysAUthorizationMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraDaysAUthorizationMasterRoutingModule { }
