import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListMailFieldsComponent } from './list-mail-fields/list-mail-fields.component';
import { AddMailFieldsComponent } from './add-mail-fields/add-mail-fields.component';


const routes: Routes = [
  { path: '', component: ListMailFieldsComponent },
  { path: 'add_mail_fields', component: AddMailFieldsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailFieldsMasterRoutingModule { }
