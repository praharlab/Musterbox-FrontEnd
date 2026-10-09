import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListVisitComponent } from './list-visit/list-visit.component';
import { AddVisitComponent } from './add-visit/add-visit.component';
import { EditVisitComponent } from './edit-visit/edit-visit.component';


const routes: Routes = [
  { path: '', component: ListVisitComponent },
  { path: 'add_visit', component: AddVisitComponent },
  { path: 'edit_visit', component: EditVisitComponent },

  // change routes add /"visit"
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitMasterRoutingModule { }
