import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form5Component } from './form5.component';


const routes: Routes = [
  { path: '', component: Form5Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form5MasterRoutingModule { }
