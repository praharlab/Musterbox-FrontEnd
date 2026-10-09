import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMailTypeComponent } from './list-mail-type/list-mail-type.component';
import { AddMailTypeComponent } from './add-mail-type/add-mail-type.component';
import { EditMailTypeComponent } from './edit-mail-type/edit-mail-type.component';


const routes: Routes = [
  { path: '', component: ListMailTypeComponent },
  { path: 'add_mailtemplate_type', component: AddMailTypeComponent },
  { path: 'edit_mailtemplate_type', component: EditMailTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailTemplateTypeMasterRoutingModule { }
