import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMyOutdoorDutyComponent } from './list-my-outdoor-duty/list-my-outdoor-duty.component';
import { AddMyOutdoorDutyComponent } from './add-my-outdoor-duty/add-my-outdoor-duty.component';
import { EditMyOutdoorDutyComponent } from './edit-my-outdoor-duty/edit-my-outdoor-duty.component';


const routes: Routes = [
  { path: '', component: ListMyOutdoorDutyComponent },
  { path: 'add_my_Outdoor_Duty', component: AddMyOutdoorDutyComponent },
  { path: 'edit_my_Outdoor_Duty', component: EditMyOutdoorDutyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutdoorDutyMasterRoutingModule { }
