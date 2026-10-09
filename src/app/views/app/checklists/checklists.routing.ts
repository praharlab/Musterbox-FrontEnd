import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChecklistsComponent } from './checklists.component';
import { ChecklistMasterComponent } from './checklist-master/checklist-master.component';

const routes: Routes = [
  {
    path: '',
    component: ChecklistsComponent,
    children: [
      { path: '', redirectTo: 'checklist_master', pathMatch: 'full' },

      { path: 'checklist_master', component: ChecklistMasterComponent },

      { path: 'checklist', loadChildren: () => import('./check_list/check-list-master.module').then((m) => m.CheckListMasterModule) },

      { path: 'checklistQuestion', loadChildren: () => import('./checklist_question/check-list-question-master.module').then((m) => m.CheckListQuestionMasterModule) },

      { path: 'userCheckList', loadChildren: () => import('./user_checklist/user-checklist-master.module').then((m) => m.UserChecklistMasterModule) },

      { path: 'checklistadmin', loadChildren: () => import('./checklist-admin/admin-checklist-master.module').then((m) => m.AdminChecklistMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChecklistsRoutingModule {}
