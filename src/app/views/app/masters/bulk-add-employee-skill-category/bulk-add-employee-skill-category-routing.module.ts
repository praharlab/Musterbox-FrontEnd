import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkAddEmployeeSkillCategoryComponent } from './bulk-add-employee-skill-category.component';



const routes: Routes = [
   {path: '', component: BulkAddEmployeeSkillCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkAddEmployeeSkillCategoryRoutingModule { }
