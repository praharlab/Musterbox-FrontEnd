import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailTemplateListComponent } from './list-template/mail-template-list.component';
import { EditMailTemplateComponent } from './edit-mail-template/edit-mail-template.component';
import { MailTemplateComponent } from './add-template/mail-template.component';


const routes: Routes = [
  { path: '', component: MailTemplateListComponent },
  { path: 'Mail-Template', component: MailTemplateComponent },
  { path: 'Edit-Mail-TemplateData', component: EditMailTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailEditorTemplateMasterRoutingModule { }
