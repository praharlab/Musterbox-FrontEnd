import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTrackingOutageCategoryDetailsComponent } from './list-tracking-outage-category-details/list-tracking-outage-category-details.component';
import { AddTrackingOutageCategoryDetailsComponent } from './add-tracking-outage-category-details/add-tracking-outage-category-details.component';
import { EditTrackingOutageCategoryDetailsComponent } from './edit-tracking-outage-category-details/edit-tracking-outage-category-details.component';


const routes: Routes = [
  {path: '', component: ListTrackingOutageCategoryDetailsComponent},
  {path: 'addTrackingOutageCategoryDetails', component: AddTrackingOutageCategoryDetailsComponent},
  {path: 'editTrackingOutageCategoryDetails', component: EditTrackingOutageCategoryDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingOutageCategoryDetailsRoutingModule { }
