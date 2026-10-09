import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form16Component } from './form16.component';


const routes: Routes = [
  { path: '', component: Form16Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form16MasterRoutingModule { }
