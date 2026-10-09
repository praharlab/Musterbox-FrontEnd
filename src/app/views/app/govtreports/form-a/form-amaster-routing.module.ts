import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormAComponent } from './form-a.component';


const routes: Routes = [
  { path: '', component: FormAComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormAMasterRoutingModule { }
