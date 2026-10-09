import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListGradeComponent } from './list-grade/list-grade.component';
import { AddGradeComponent } from './add-grade/add-grade.component';
import { EditGradeComponent } from './edit-grade/edit-grade.component';


const routes: Routes = [
  { path: '', component: ListGradeComponent },
  { path: 'add_grade', component: AddGradeComponent },
  { path: 'edit_grade', component: EditGradeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryGradeMasterRoutingModule { }
