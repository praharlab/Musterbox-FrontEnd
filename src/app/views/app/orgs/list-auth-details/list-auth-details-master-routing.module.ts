import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAuthDetailsComponent } from './list-auth-details.component';


const routes: Routes = [
  { path: '', component: ListAuthDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListAuthDetailsMasterRoutingModule { }
