import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListempLeaveComponent } from './listemp-leave/listemp-leave.component';
import { AddempLeaveComponent } from './addemp-leave/addemp-leave.component';
import { EditempLeaveComponent } from './editemp-leave/editemp-leave.component';


const routes: Routes = [
  { path: '', component: ListempLeaveComponent },
  { path: 'add_employeeLeave', component: AddempLeaveComponent },
  { path: 'edit_employeeLeave', component: EditempLeaveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpLeaveMasterRoutingModule { }
