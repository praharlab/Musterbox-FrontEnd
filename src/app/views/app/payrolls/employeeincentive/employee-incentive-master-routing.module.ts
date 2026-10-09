import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeincentiveComponent } from './list-employeeincentive/list-employeeincentive.component';
import { AddEmployeeincentiveComponent } from './add-employeeincentive/add-employeeincentive.component';
import { EditEmployeeincentiveComponent } from './edit-employeeincentive/edit-employeeincentive.component';


const routes: Routes = [
  { path: '', component: ListEmployeeincentiveComponent },
  { path: 'add-employeeincentive', component: AddEmployeeincentiveComponent },
  { path: 'edit-employeeincentive', component: EditEmployeeincentiveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeIncentiveMasterRoutingModule { }
