import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TdsSubsectionCategoryComponent } from './tds-subsection-category.component';


const routes: Routes = [
  { path: '', component: TdsSubsectionCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TdsSubSectionCategoryMasterRoutingModule { }
