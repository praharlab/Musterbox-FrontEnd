import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTdsSectionComponent } from './list-tds-section/list-tds-section.component';
import { AddTdsSectionComponent } from './add-tds-section/add-tds-section.component';
import { EditTdsSectionComponent } from './edit-tds-section/edit-tds-section.component';


const routes: Routes = [
  { path: '', component: ListTdsSectionComponent },
  { path: 'add_tds_section', component: AddTdsSectionComponent },
  { path: 'edit_tds_section', component: EditTdsSectionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TdsSectionMasterRoutingModule { }
