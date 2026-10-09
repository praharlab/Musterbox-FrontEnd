import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnonymousFeedbackComponent } from './anonymous-feedback/anonymous-feedback.component';


const routes: Routes = [
  { path: '', component: AnonymousFeedbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousFeedbackMasterRoutingModule { }
