import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewRequestComponent } from './review-request.component';


const routes: Routes = [
  { path: '', component: ReviewRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRequestMasterRoutingModule { }
