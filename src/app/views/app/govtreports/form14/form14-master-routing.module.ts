import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form14Component } from './form14.component';


const routes: Routes = [
  { path: '', component: Form14Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form14MasterRoutingModule { }
