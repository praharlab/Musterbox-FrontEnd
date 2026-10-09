import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReplaceAuthDetailsComponent } from './replace-auth-details.component';


const routes: Routes = [
  { path: '', component: ReplaceAuthDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReplaceAuthDetailsMasterRoutingModule { }
