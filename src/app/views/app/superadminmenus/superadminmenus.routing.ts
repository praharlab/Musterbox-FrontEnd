import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperadminmenusComponent } from './superadminmenus.component';
import { SuperadminMenuComponent } from './superadmin-menu/superadmin-menu.component';
import { SubadminCompanyMasterComponent } from './subadmin-company-master/subadmin-company-master.component';
import { ListSubscriptionPlanAnalytictsComponent } from './list-subscription-plan-analyticts/list-subscription-plan-analyticts.component';
import { TotalPunchInAllcompanyComponent } from './total-punch-in-allcompany/total-punch-in-allcompany.component'
import { ListCompanyProgressComponent } from './company-progress/list-company-progress/list-company-progress.component';

import { ListCompanyTrainingComponent } from './company-Training/list-company-training/list-company-training.component';
import { AddCompanyTrainingComponent } from './company-Training/add-company-training/add-company-training.component';
import { EditCompanyTrainingComponent } from './company-Training/edit-company-training/edit-company-training.component';
//superadmin routing
const routes: Routes = [
  {
    path: '',
    component: SuperadminmenusComponent,
    children: [
      { path: '', redirectTo: 'superAdminMenu', pathMatch: 'full' },

      {
        path: 'superAdminMenu',
        component: SuperadminMenuComponent,
      },

      { path: 'company_subscription', loadChildren: () => import('./subscription_plan/subscription-plan-master.module').then((m) => m.SubscriptionPlanMasterModule) },

      { path: 'company_type', loadChildren: () => import('./company_type/company-type-master.module').then((m) => m.CompanyTypeMasterModule) },

      { path: 'mailTemplate_type', loadChildren: () => import('./mailtemplate_type/mail-template-type-master.module').then((m) => m.MailTemplateTypeMasterModule) },

      { path: 'mail_fields', loadChildren: () => import('./mail-fields/mail-fields-master.module').then((m) => m.MailFieldsMasterModule) },

      { path: 'letter_type', loadChildren: () => import('./letter-template/letter-template-master.module').then((m) => m.LetterTemplateMasterModule) },

      { path: 'letter_fields', loadChildren: () => import('./letter-fields/letter-fields-master.module').then((m) => m.LetterFieldsMasterModule) },

      { path: 'product_master', loadChildren: () => import('./product_master/product-master.module').then((m) => m.ProductMasterModule) },

      { path: 'bank', loadChildren: () => import('./bank_master/bank-master.module').then((m) => m.BankMasterModule) },

      { path: 'bankBranch', loadChildren: () => import('./bank-branch/bank-branch-master.module').then((m) => m.BankBranchMasterModule) },

      { path: 'ptmaster', loadChildren: () => import('./ptmaster/ptm-master.module').then((m) => m.PtmMasterModule) },

      { path: 'document_list', loadChildren: () => import('./document_list/document-list-master.module').then((m) => m.DocumentListMasterModule) },

      { path: 'company_document', loadChildren: () => import('./compnay_document/company-document-master.module').then((m) => m.CompanyDocumentMasterModule) },

      { path: 'operation', loadChildren: () => import('./operation/operation-master.module').then((m) => m.OperationMasterModule) },

      { path: 'form', loadChildren: () => import('./form_master/form-master.module').then((m) => m.FormMasterModule) },

      { path: 'payheadmaster', loadChildren: () => import('./payheadmaster/payhead-master.module').then((m) => m.PayheadMasterModule) },

      { path: 'leaveMaster', loadChildren: () => import('./LeaveMaster/leave-master.module').then((m) => m.LeaveMasterModule) },

      { path: 'appversion', loadChildren: () => import('./appversion/app-version-master.module').then((m) => m.AppVersionMasterModule) },

      { path: 'superadmin', loadChildren: () => import('./superadmin/super-admin-master.module').then((m) => m.SuperAdminMasterModule) },

      { path: 'subadmin', loadChildren: () => import('./subadmin/sub-admin-master.module').then((m) => m.SubAdminMasterModule) },

      { path: 'subadmincompanylist/:name', component: SubadminCompanyMasterComponent },

      { path: 'auth_master', loadChildren: () => import('./authorizationMaster/authorization-master.module').then((m) => m.AuthorizationMasterModule) },

      { path: 'company_report', loadChildren: () => import('../reports/companyReport/company-report-master.module').then((m) => m.CompanyReportMasterModule) },

      { path: 'form16', loadChildren: () => import('./form_16/form16-master.module').then((m) => m.Form16MasterModule) },

      { path: 'biometric_integration', loadChildren: () => import('./biometric_integration/biometric-integration-master.module').then((m) => m.BiometricIntegrationMasterModule) },

      { path: 'Module_list', loadChildren: () => import('./Module-List/module-list-master.module').then((m) => m.ModuleListMasterModule) },

      { path: 'Module_details', loadChildren: () => import('./Module-Details/module-details-master.module').then((m) => m.ModuleDetailsMasterModule) },

      { path: 'hr_toolkit', loadChildren: () => import('../payrolls/hr-toolkit/hr-toolkit-master.module').then((m) => m.HrToolkitMasterModule) },

      { path: 'list_incomeTaxSlabMaster', loadChildren: () => import('./incomeTaxSlabMaster/income-tax-slab-master.module').then((m) => m.IncomeTaxSlabMasterModule) },

      { path: 'list_incomeTaxSlab', loadChildren: () => import('./incomeTaxSlabs/income-tax-slabs-master.module').then((m) => m.IncomeTaxSlabsMasterModule) },

      { path: 'listSubscriptionPlanAnalyticts', component: ListSubscriptionPlanAnalytictsComponent },
      { path: 'companyall_punchin', component: TotalPunchInAllcompanyComponent },

      { path: 'ai_biometric', loadChildren: () => import('./ai-biometric/ai-biometric-master.module').then((m) => m.AiBiometricMasterModule) },

      { path: 'list_dealer', loadChildren: () => import('./dealer/dealer-master.module').then((m) => m.DealerMasterModule) },

      { path: 'dealerplan', loadChildren: () => import('./dealerPlan/dealer-plan-master.module').then((m) => m.DealerPlanMasterModule) },

      { path: 'listLeadMaster', loadChildren: () => import('./Lead/lead-master.module').then((m) => m.LeadMasterModule) },

      { path: 'company_service_status', loadChildren: () => import('./comapany-service-status/company-service-status-master.module').then((m) => m.CompanyServiceStatusMasterModule) },

      { path: 'company_progress', component: ListCompanyProgressComponent },

      { path: 'company_training', component: ListCompanyTrainingComponent },
      { path: 'add_company_training', component: AddCompanyTrainingComponent },
      { path: 'edit_company_training', component: EditCompanyTrainingComponent },

      { path: 'list-resignation-reason', loadChildren: () => import('./resignation-reason/resignation-reason-master.module').then((m) => m.ResignationReasonMasterModule) },

      { path: 'list_tds_section', loadChildren: () => import('../income-tax/tds-section/tds-section-master.module').then((m) => m.TdsSectionMasterModule) },

      { path: 'list_tds_sub_section', loadChildren: () => import('../income-tax/tds-subsection/tds-sub-section-master.module').then((m) => m.TdsSubSectionMasterModule) },

      { path: 'tds_subsection_category', loadChildren: () => import('../income-tax/tds-subsection-category/tds-sub-section-category-master.module').then((m) => m.TdsSubSectionCategoryMasterModule) },

      { path: 'tracking-outage-category', loadChildren: () => import('./tracking-outage-category/tracking-outage-category.module').then((m) => m.TrackingOutageCategoryModule) },
      { path: 'tracking-outage-category-details', loadChildren: () => import('./tracking-outage-category-details/tracking-outage-category-details.module').then((m) => m.TrackingOutageCategoryDetailsModule) },
      { path: 'district', loadChildren: () => import('./district/district.module').then((m) => m.DistrictModule) },

      { path: 'tax-standard-deduction', loadChildren: () => import('./tax-standard-deduction/tax-standard-deduction-routing.module').then((m) => m.TaxStandardDeductionRoutingModule) },

      { path: 'tax-rebate', loadChildren: () => import('./tax-rebate/tax-rebate.module').then((m) => m.TaxRebateModule) },

      { path: 'list_tds_sub_section_limit', loadChildren: () => import('../income-tax/tds-subsection-limit/tds-subsection-limit-routing.module').then((m) => m.TdsSubsectionLimitRoutingModule) },

      { path: 'orgAuthorizationType', loadChildren: () => import('./org-authorization-type/org-authorization-type.module').then((m) => m.OrgAuthorizationTypeModule) }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperadminmenusRoutingModule { }
