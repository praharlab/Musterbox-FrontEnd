import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form21Component } from './form21.component';


const routes: Routes = [
  { path: '', component: Form21Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form21MasterRoutingModule { }
