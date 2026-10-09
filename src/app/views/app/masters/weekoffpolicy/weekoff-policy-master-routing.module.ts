import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListWeekoffpolicyComponent } from './list-weekoffpolicy/list-weekoffpolicy.component';
import { AddWeekoffpolicyComponent } from './add-weekoffpolicy/add-weekoffpolicy.component';
import { EditWeekoffpolicyComponent } from './edit-weekoffpolicy/edit-weekoffpolicy.component';


const routes: Routes = [
  { path: '', component: ListWeekoffpolicyComponent },
  { path: 'add_weekoffpolicy', component: AddWeekoffpolicyComponent },
  { path: 'edit_weekoffpolicy', component: EditWeekoffpolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekoffPolicyMasterRoutingModule { }
