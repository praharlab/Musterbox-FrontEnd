import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-superadmin-menu',
    templateUrl: './superadmin-menu.component.html',
    styleUrls: ['./superadmin-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SuperadminMenuComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  mainArray: any = [];
  adminRoot = environment.adminRoot;

  constructor() { }

  ngOnInit(): void {
    let id = Number(localStorage.getItem('usertype'));
    if (id == 2) {
      this.visible = true;
      this.mainArray = [
        {
          icon: 'iconsminds-embassy',
          label: 'Company',
          menu: 'Company',
          to: `${this.adminRoot}/superadminmenus/company_master`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-check',
          label: 'Company Type',
          menu: 'CompanyType',
          to: `${this.adminRoot}/superadminmenus/company_type`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-check',
          label: 'Company Stages',
          menu: 'CompanyType',
          to: `${this.adminRoot}/superadminmenus/company_service_status`,
        },

        {
          icon: 'iconsminds-check',
          label: 'Mail Template Type',
          menu: 'MailTemplateType',
          to: `${this.adminRoot}/superadminmenus/mailTemplate_type`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-check',
          label: 'Mail Fields',
          menu: 'MailFields',
          to: `${this.adminRoot}/superadminmenus/mail_fields`,
          // roles: [UserRole.Admin],
        },

        {
          icon: 'iconsminds-check',
          label: 'Letter Tamplate Type',
          menu: 'LetterTamplateType',
          to: `${this.adminRoot}/superadminmenus/letter_type`,
          // roles: [UserRole.Admin],
        },

        {
          icon: 'iconsminds-check',
          label: 'Letter Fields',
          menu: 'LetterFields',
          to: `${this.adminRoot}/superadminmenus/letter_fields`,
          // roles: [UserRole.Admin],
        },

        {
          icon: 'iconsminds-bag-items',
          label: 'Subscription Plan',
          menu: 'ProductMaster',
          to: `${this.adminRoot}/superadminmenus/product_master`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-money-bag',
          label: 'Bank',
          menu: 'Bank',
          to: `${this.adminRoot}/superadminmenus/bank`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-money-bag',
          label: 'Bank Branch',
          menu: 'Bank',
          to: `${this.adminRoot}/superadminmenus/bankBranch`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-equalizer',
          label: 'PT Master',
          menu: 'PTSetup',
          to: `${this.adminRoot}/superadminmenus/ptmaster`,
        },
        {
          icon: 'iconsminds-file',
          label: 'Document List',
          menu: 'DocumentList',
          to: `${this.adminRoot}/superadminmenus/document_list`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-files',
          label: 'Company Doc List',
          menu: 'CompanyDocList',
          to: `${this.adminRoot}/superadminmenus/company_document`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-add',
          label: 'Operation',
          menu: 'Operation',
          to: `${this.adminRoot}/superadminmenus/operation`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-add-file',
          label: 'Form',
          menu: 'Form',
          to: `${this.adminRoot}/superadminmenus/form`,
          // roles: [UserRole.Admin],
        },
        {
          icon: 'iconsminds-shop-4',
          label: 'Payhead Master',
          to: `${this.adminRoot}/superadminmenus/payheadmaster`,
          menu: 'PayheadMaster',
        },
        {
          icon: 'iconsminds-shop-4',
          label: 'Leave Master',
          to: `${this.adminRoot}/superadminmenus/leaveMaster`,
          menu: 'LeaveMaster',
        },
        {
          icon: 'iconsminds-shop-4',
          label: 'Resignation Reason',
          to: `${this.adminRoot}/superadminmenus/list-resignation-reason`,
          menu: 'SuperAdmin',
        },
        {
          icon: 'iconsminds-smartphone-3',
          label: 'App Version',
          to: `${this.adminRoot}/superadminmenus/appversion`,
          menu: 'AppVersion',
        },
        {
          icon: 'iconsminds-user',
          label: 'Super Admin',
          to: `${this.adminRoot}/superadminmenus/superadmin`,
          menu: 'SuperAdmin',
        },
        {
          icon: 'iconsminds-user',
          label: 'Sub Admin',
          to: `${this.adminRoot}/superadminmenus/subadmin`,
          menu: 'SubAdmin',
        },
        {
          icon: 'iconsminds-user',
          label: 'Dealer',
          to: `${this.adminRoot}/superadminmenus/list_dealer`,
          menu: 'SuperAdmin',
        },
        {
          icon: 'iconsminds-user',
          label: 'Dealer Plan',
          to: `${this.adminRoot}/superadminmenus/dealerplan`,
          menu: 'SuperAdmin',
        },
        {
          icon: 'iconsminds-user',
          label: 'Auth Master',
          to: `${this.adminRoot}/superadminmenus/auth_master`,
          menu: 'auth_master',
        },
        {
          icon: 'iconsminds-user',
          label: 'Report',
          to: `${this.adminRoot}/superadminmenus/company_report`,
          menu: 'auth_master',
        },

        {
          icon: 'iconsminds-notepad',
          label: 'Form 16',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/form16`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'Biometric',
          menu: 'biometric',
          to: `${this.adminRoot}/superadminmenus/biometric_integration`,
        },
        {
          icon: 'iconsminds-notepad',
          label: 'Ai Biometric',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/ai_biometric`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'Module List',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/Module_list`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'Module Details',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/Module_details`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'HR Toolkit',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/hr_toolkit`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'Income Tax Slab Master',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/list_incomeTaxSlabMaster`,
        },
        {
          icon: 'iconsminds-notepad',
          label: 'Income Tax Slabs',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/list_incomeTaxSlab`,
        },
        {
          icon: 'iconsminds-notepad',
          label: 'TDS Section',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/list_tds_section`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'TDS Sub Section Category',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/tds_subsection_category`,
        },
        {
          icon: 'iconsminds-notepad',
          label: 'TDS Sub Section',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/list_tds_sub_section`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'TDS Sub Section Limit',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/list_tds_sub_section_limit`,
        },

        {
          icon: 'iconsminds-notepad',
          label: 'Lead',
          menu: 'form16',
          to: `${this.adminRoot}/superadminmenus/listLeadMaster`,
        }, {
          icon: 'iconsminds-notepad',
          label: 'Tracking Outage Category',
          menu: 'trackingOutageCategory',
          to: `${this.adminRoot}/superadminmenus/tracking-outage-category`,
        }, {
          icon: 'iconsminds-notepad',
          label: 'Tracking Outage Category Details',
          menu: 'trackingOutageCategoryDetails',
          to: `${this.adminRoot}/superadminmenus/tracking-outage-category-details`,
        },
        {
          icon: 'iconsminds-embassy',
          label: 'District',
          menu: 'Company',
          to: `${this.adminRoot}/superadminmenus/district/`,
        },
        {
          icon: 'iconsminds-embassy',
          label: 'Tax Standard Deduction',
          menu: 'Company',
          to: `${this.adminRoot}/superadminmenus/tax-standard-deduction`,
        },
        {
          icon: 'iconsminds-embassy',
          label: 'Tax Rebate',
          menu: 'Company',
          to: `${this.adminRoot}/superadminmenus/tax-rebate`,
        },
        {
          icon: 'iconsminds-embassy',
          label: 'Org Authorization Type',
          menu: 'OrgAuthorizationType',
          to: `${this.adminRoot}/superadminmenus/orgAuthorizationType`,
        },
      ];
    }
  }
}
