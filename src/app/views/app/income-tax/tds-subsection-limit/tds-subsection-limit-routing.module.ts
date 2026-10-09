import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTdsSubsectionLimitComponent } from './list-tds-subsection-limit/list-tds-subsection-limit.component';
import { AddTdsSubsectionLimitComponent } from './add-tds-subsection-limit/add-tds-subsection-limit.component';
import { EditTdsSubsectionLimitComponent } from './edit-tds-subsection-limit/edit-tds-subsection-limit.component';


const routes: Routes = [
    { path: '', component: ListTdsSubsectionLimitComponent },
    { path: 'add_tds_sub_section_limit', component: AddTdsSubsectionLimitComponent },
    { path: 'edit_tds_sub_section_limit', component: EditTdsSubsectionLimitComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TdsSubsectionLimitRoutingModule { }
