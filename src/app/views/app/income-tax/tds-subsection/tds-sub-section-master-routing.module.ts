import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTdsSubsectionComponent } from './list-tds-subsection/list-tds-subsection.component';
import { AddTdsSubsectionComponent } from './add-tds-subsection/add-tds-subsection.component';
import { EditTdsSubsectionComponent } from './edit-tds-subsection/edit-tds-subsection.component';


const routes: Routes = [
  { path: '', component: ListTdsSubsectionComponent },
  { path: 'add_tds_sub_section', component: AddTdsSubsectionComponent },
  { path: 'edit_tds_sub_section', component: EditTdsSubsectionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TdsSubSectionMasterRoutingModule { }
