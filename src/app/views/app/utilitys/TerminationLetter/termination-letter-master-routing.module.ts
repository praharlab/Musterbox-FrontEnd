import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditTerminationLetterComponent } from './edit-termination-letter/edit-termination-letter.component';
import { AddTerminationLetterComponent } from './add-termination-letter/add-termination-letter.component';
import { ListTerminationLetterComponent } from './list-termination-letter/list-termination-letter.component';


const routes: Routes = [
  { path: '', component: ListTerminationLetterComponent },
  { path: 'Add-termination-Letter', component: AddTerminationLetterComponent },
  { path: 'Edit-termination-Letter', component: EditTerminationLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminationLetterMasterRoutingModule { }
