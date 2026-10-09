import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Form28Component } from './form28.component';


const routes: Routes = [
  { path: '', component: Form28Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form28MasterRoutingModule { }
