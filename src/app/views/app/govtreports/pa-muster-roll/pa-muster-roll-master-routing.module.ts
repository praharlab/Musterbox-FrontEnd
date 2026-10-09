import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaMusterRollComponent } from './pa-muster-roll.component';


const routes: Routes = [
  { path: '', component: PaMusterRollComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaMusterRollMasterRoutingModule { }
