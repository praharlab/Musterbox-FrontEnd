import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListShiftComponent } from './list-shift/list-shift.component';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';


const routes: Routes = [
  { path: '', component: ListShiftComponent },
  { path: 'add_shift', component: AddShiftComponent },
  { path: 'edit_shift', component: EditShiftComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftMasterRoutingModule { }
