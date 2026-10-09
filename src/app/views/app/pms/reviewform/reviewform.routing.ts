import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListReviewFormComponent } from './reviewForm/list-review-form/list-review-form.component';
import { AddReviewFormComponent } from './reviewForm/add-review-form/add-review-form.component';
import { EditReviewFormComponent } from './reviewForm/edit-review-form/edit-review-form.component';

const routes: Routes = [
  // { path: '', redirectTo: '/listReviewForm', pathMatch: 'full' },
  { path: '', component: ListReviewFormComponent },
  { path: 'addReviewForm', component: AddReviewFormComponent },
  { path: 'editReviewForm', component: EditReviewFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewformRoutingModule {}
