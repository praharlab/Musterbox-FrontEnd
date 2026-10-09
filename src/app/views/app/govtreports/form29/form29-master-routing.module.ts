import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form29Component } from './form29.component';


const routes: Routes = [
  { path: '', component: Form29Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form29MasterRoutingModule { }
