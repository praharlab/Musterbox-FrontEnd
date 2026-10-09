import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilitysComponent } from './utilitys.component';
import { ListLetterEditorComponent } from './LetterEditorTemplate/list-letter-editor/list-letter-editor.component';
import { AddLetterEditorComponent } from './LetterEditorTemplate/add-letter-editor/add-letter-editor.component';
import { UtilityMasterComponent } from './utility-master/utility-master.component';
import { EditLetterEditorComponent } from './LetterEditorTemplate/edit-letter-editor/edit-letter-editor.component';
import { AddDiscrepancyLetterComponent } from './discrepancyLetter/add-discrepancy-letter/add-discrepancy-letter.component';
import { EditDiscrepancyLetterComponent } from './discrepancyLetter/edit-discrepancy-letter/edit-discrepancy-letter.component';
import { ListDiscrepancyLetterComponent } from './discrepancyLetter/list-discrepancy-letter/list-discrepancy-letter.component';

const routes: Routes = [
  {
    path: '',
    component: UtilitysComponent,
    children: [
      { path: '', redirectTo: 'utility_master', pathMatch: 'full' },

      { path: 'utility_master', component: UtilityMasterComponent },

      { path: 'notification_policy', loadChildren: () => import('./notification-policy/notification-policy-master.module').then((m) => m.NotificationPolicyMasterModule) },

      { path: 'List-Letter-Template', component: ListLetterEditorComponent },
      { path: 'Add-Letter-Template', component: AddLetterEditorComponent },
      { path: 'Edit-Letter-Template', component: EditLetterEditorComponent },

      { path: 'Mail-Template-List', loadChildren: () => import('./MailEditorTemplate/mail-editor-template-master.module').then((m) => m.MailEditorTemplateMasterModule) },

      { path: 'List-Offer-Letter', loadChildren: () => import('./offerLetter/offer-letter-master.module').then((m) => m.OfferLetterMasterModule) },

      { path: 'notification_setup', loadChildren: () => import('./notification-setup/notification-setup-master.module').then((m) => m.NotificationSetupMasterModule) },

      { path: 'Auto-Mail-Setup', loadChildren: () => import('./autoMailSetup/auto-mail-setup-master.module').then((m) => m.AutoMailSetupMasterModule) },

      { path: 'List-Joining-Letter', loadChildren: () => import('./joiningLetter/joining-letter-master.module').then((m) => m.JoiningLetterMasterModule) },

      { path: 'List-experience-Letter', loadChildren: () => import('./ExperienceLetter/experience-letter-master.module').then((m) => m.ExperienceLetterMasterModule) },

      { path: 'List-increment-Letter', loadChildren: () => import('./IncrementLetter/increment-letter-master.module').then((m) => m.IncrementLetterMasterModule) },

      { path: 'List-termination-Letter', loadChildren: () => import('./TerminationLetter/termination-letter-master.module').then((m) => m.TerminationLetterMasterModule) },

      { path: 'list_erpIntegration', loadChildren: () => import('./erpIntegration/erp-integration-master.module').then((m) => m.ErpIntegrationMasterModule) },

      { path: 'appoinment', loadChildren: () => import('./appointmentLetter/appointment-letter-master.module').then((m) => m.AppointmentLetterMasterModule) },

      { path: 'audit-logs', loadChildren: () => import('./list-audit-logs/audit-logs-master.module').then((m) => m.AuditLogsMasterModule) },

      { path: 'Add-Discrepancy-Letter', component: AddDiscrepancyLetterComponent },
      { path: 'Edit-Discrepancy-Letter', component: EditDiscrepancyLetterComponent },
      { path: 'List-Discrepancy-Letter', component: ListDiscrepancyLetterComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilitysRoutingModule { }
