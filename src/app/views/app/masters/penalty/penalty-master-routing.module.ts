import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPenaltyComponent } from './list-penalty/list-penalty.component';
import { AddPenaltyComponent } from './add-penalty/add-penalty.component';
import { EditPenaltyComponent } from './edit-penalty/edit-penalty.component';


const routes: Routes = [
  { path: '', component: ListPenaltyComponent },
  { path: 'add_penalty', component: AddPenaltyComponent },
  { path: 'edit_penalty', component: EditPenaltyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenaltyMasterRoutingModule { }
