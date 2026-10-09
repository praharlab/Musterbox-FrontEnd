import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillsetsComponent } from './skillsets.component';
import { SkillsetsMasterComponent } from './skillsets-master/skillsets-master.component';
import { AddUserskillsetsFormComponent } from './add-userskillsets-form/add-userskillsets-form.component';
import { EditFieldskillsetsFormComponent } from './edit-fieldskillsets-form/edit-fieldskillsets-form.component';
const routes: Routes = [
  {
    path: '',
    component: SkillsetsComponent,
    children: [
      { path: '', redirectTo: 'skillsets_master', pathMatch: 'full' },
      { path: 'skillsets_master', component: SkillsetsMasterComponent },

      { path: 'skillset', loadChildren: () => import('./skillsets_master/skillsets-master.module').then((m) => m.SkillsetsMasterModule) },

      { path: 'skillsetform', loadChildren: () => import('./skillsetform/skillset-form-master.module').then((m) => m.SkillsetFormMasterModule) },

      { path: 'monthlySkillsetform', loadChildren: () => import('./monthly-skillsetform/monthly-skillset-form-master.module').then((m) => m.MonthlySkillsetFormMasterModule) },

      { path: 'user-skillsets-form', loadChildren: () => import('./user-skillsets-form/user-skillsets-form-master.module').then((m) => m.UserSkillsetsFormMasterModule) },

      { path: 'addMonthlySkillsetsForm', component: AddUserskillsetsFormComponent },

      { path: 'field-skillsets-form', loadChildren: () => import('./field-skillsets-form/field-skillsets-form-master.module').then((m) => m.FieldSkillsetsFormMasterModule) },

      { path: 'editMonthlySkillsetsForm', component: EditFieldskillsetsFormComponent },

      { path: 'skillsetsReport', loadChildren: () => import('./skillsets-report/skillsets-report-master.module').then((m) => m.SkillsetsReportMasterModule) },

      { path: 'userSkillsetsReport', loadChildren: () => import('./user-skillsets-report/user-skillsets-report-master.module').then((m) => m.UserSkillsetsReportMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillsetsRoutingModule {}
