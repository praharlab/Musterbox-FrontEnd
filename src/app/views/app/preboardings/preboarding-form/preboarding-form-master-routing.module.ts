import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPreboardingFormComponent } from './list-preboarding-form/list-preboarding-form.component';
import { AddPreboardingFormComponent } from './add-preboarding-form/add-preboarding-form.component';
import { EditPreboardingFormComponent } from './edit-preboarding-form/edit-preboarding-form.component';


const routes: Routes = [
  { path: '', component: ListPreboardingFormComponent },
  { path: 'add_preboarding_form', component: AddPreboardingFormComponent },
  { path: 'edit_preboarding_form', component: EditPreboardingFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreboardingFormMasterRoutingModule { }
