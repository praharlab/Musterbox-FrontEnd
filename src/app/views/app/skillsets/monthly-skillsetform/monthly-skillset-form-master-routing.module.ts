import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMonthlySkillsetformComponent } from './list-monthly-skillsetform/list-monthly-skillsetform.component';
import { AddMonthlySkillsetformComponent } from './add-monthly-skillsetform/add-monthly-skillsetform.component';
import { EditMonthlySkillsetformComponent } from './edit-monthly-skillsetform/edit-monthly-skillsetform.component';


const routes: Routes = [
  { path: '', component: ListMonthlySkillsetformComponent },
  { path: 'add_monthlySkillsetform', component: AddMonthlySkillsetformComponent },
  { path: 'edit_monthlySkillsetform', component: EditMonthlySkillsetformComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlySkillsetFormMasterRoutingModule { }
