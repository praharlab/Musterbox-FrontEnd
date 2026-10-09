import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListFnfComponent } from './list-fnf.component';
import { ViewFnfComponent } from '../view-fnf/view-fnf.component';


const routes: Routes = [
  { path: '', component: ListFnfComponent },
  { path: 'view', component: ViewFnfComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFnfRoutingModule { }
