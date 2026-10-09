import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTrackingOutageCategoryComponent } from './list-tracking-outage-category/list-tracking-outage-category.component';
import { AddTrackingOutageCategoryComponent } from './add-tracking-outage-category/add-tracking-outage-category.component';
import { EditTrackingOutageCategoryComponent } from './edit-tracking-outage-category/edit-tracking-outage-category.component';


const routes: Routes = [
  {path: '', component: ListTrackingOutageCategoryComponent},
  {path: 'addTrackingOutageCategory', component: AddTrackingOutageCategoryComponent},
  {path: 'editTrackingOutageCategory', component: EditTrackingOutageCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingOutageCategoryRoutingModule { }
