import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormBComponent } from './form-b.component';


const routes: Routes = [
  { path: '', component: FormBComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormBMasterRoutingModule { }
