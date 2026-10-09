import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeSkillCategoryComponent } from './list-employee-skill-category.component';


const routes: Routes = [
   {path: '', component: ListEmployeeSkillCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListEmployeeSkillCategoryRoutingModule { }
