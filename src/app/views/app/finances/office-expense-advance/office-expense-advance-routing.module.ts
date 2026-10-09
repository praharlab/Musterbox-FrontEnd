import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOfficeExpAdvanceComponent } from './list-office-exp-advance/list-office-exp-advance.component';
import { AddOfficeExpAdvanceComponent } from './add-office-exp-advance/add-office-exp-advance.component';


const routes: Routes = [
  { path: '', component: ListOfficeExpAdvanceComponent },
  { path: 'add', component: AddOfficeExpAdvanceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeExpenseAdvanceRoutingModule { }
