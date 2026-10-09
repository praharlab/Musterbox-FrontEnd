import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListjoiningRequestComponent } from './listjoining-request.component';


const routes: Routes = [
  { path: '', component: ListjoiningRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListJoiningRequestMasterRoutingModule { }
