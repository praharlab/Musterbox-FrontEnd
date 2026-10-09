import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListleaveTypesComponent } from './listleave-types/listleave-types.component';
import { AddleaveTypesComponent } from './addleave-types/addleave-types.component';
import { EditleaveTypesComponent } from './editleave-types/editleave-types.component';


const routes: Routes = [
  { path: '', component: ListleaveTypesComponent },
  { path: 'addleavetypes', component: AddleaveTypesComponent },
  { path: 'editleavetypes', component: EditleaveTypesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveTypeMasterRoutingModule { }
