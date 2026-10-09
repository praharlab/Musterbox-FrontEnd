import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormCComponent } from './form-c.component';


const routes: Routes = [
  { path: '', component: FormCComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormCMasterRoutingModule { }
