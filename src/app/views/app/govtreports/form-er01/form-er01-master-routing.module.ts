import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormER01Component } from './form-er01.component';


const routes: Routes = [
  { path: '', component: FormER01Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormEr01MasterRoutingModule { }
