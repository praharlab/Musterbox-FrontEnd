import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTourComponent } from './list-tour/list-tour.component';
import { AddTourComponent } from './add-tour/add-tour.component';
import { EditTourComponent } from './edit-tour/edit-tour.component';


const routes: Routes = [
  { path: '', component: ListTourComponent },
  { path: 'add_tour', component: AddTourComponent },
  { path: 'edit_tour', component: EditTourComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourMasterRoutingModule { }
