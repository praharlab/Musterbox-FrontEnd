import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAnonymousFeedbackComponent } from './list-anonymous-feedback.component';


const routes: Routes = [
  { path: '', component: ListAnonymousFeedbackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousFeedbackMasterRoutingModule { }
