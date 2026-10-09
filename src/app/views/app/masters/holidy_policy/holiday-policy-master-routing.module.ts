import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListHolidayPolicyComponent } from './list-holiday-policy/list-holiday-policy.component';
import { AddHolidayPolicyComponent } from './add-holiday-policy/add-holiday-policy.component';
import { EditHolidayPolicyComponent } from './edit-holiday-policy/edit-holiday-policy.component';


const routes: Routes = [
  { path: '', component: ListHolidayPolicyComponent },
  { path: 'add_holidayPolicy', component: AddHolidayPolicyComponent },
  { path: 'edit_holidayPolicy', component: EditHolidayPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayPolicyMasterRoutingModule { }
