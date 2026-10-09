import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAutoMailSetupComponent } from './list-auto-mail-setup/list-auto-mail-setup.component';
import { AddAutoMailSetupComponent } from './add-auto-mail-setup/add-auto-mail-setup.component';
import { EditAutoMailSetupComponent } from './edit-auto-mail-setup/edit-auto-mail-setup.component';


const routes: Routes = [
  { path: '', component: ListAutoMailSetupComponent },
  { path: 'Add-Auto-Mail-Setup', component: AddAutoMailSetupComponent },
  { path: 'Edit-Auto-Mail-Setup', component: EditAutoMailSetupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoMailSetupMasterRoutingModule { }
