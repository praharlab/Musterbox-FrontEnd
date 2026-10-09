import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResignationListComponent } from './resignation-list.component';


const routes: Routes = [
  { path: '', component: ResignationListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResignationListMasterRoutingModule { }
