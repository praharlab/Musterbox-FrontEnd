import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form7Component } from './form7.component';


const routes: Routes = [
  { path: '', component: Form7Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form7MasterRoutingModule { }
