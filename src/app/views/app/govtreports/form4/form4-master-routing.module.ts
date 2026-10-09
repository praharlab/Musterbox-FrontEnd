import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form4Component } from './form4.component';


const routes: Routes = [
  { path: '', component: Form4Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form4MasterRoutingModule { }
