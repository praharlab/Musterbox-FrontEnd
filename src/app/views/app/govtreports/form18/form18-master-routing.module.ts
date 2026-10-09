import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form18Component } from './form18.component';


const routes: Routes = [
  { path: '', component: Form18Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form18MasterRoutingModule { }
