import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form11Component } from './form11.component';


const routes: Routes = [
  { path: '', component: Form11Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form11MasterRoutingModule { }
