import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-utility-master',
    templateUrl: './utility-master.component.html',
    styleUrls: ['./utility-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UtilityMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  adminRoot = environment.adminRoot;

  UtilityArray: any = [];
  ERP: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.UtilityArray = [
      {
        icon: 'iconsminds-email',
        label: 'Mail Setup',
        menu: 'MailSetup',
        to: `${this.adminRoot}/utilitys/notification_policy`,
      },
      {
        icon: 'iconsminds-bell',
        label: 'Notification Setup',
        menu: 'NotificationSetup',
        to: `${this.adminRoot}/utilitys/notification_setup`,
      },
      {
        icon: 'iconsminds-mail',
        label: 'Auto Mail Setup',
        menu: 'AutoMailSetup',
        to: `${this.adminRoot}/utilitys/Auto-Mail-Setup`,
      },
      {
        icon: 'iconsminds-mail',
        label: 'Mail Template',
        menu: 'MailTemplate',
        to: `${this.adminRoot}/utilitys/Mail-Template-List`,
      },
      // {
      //   icon: 'iconsminds-notepad',
      //   label: 'Letter Template',
      //   menu: 'LetterTemplate',
      //   to: `${this.adminRoot}/utilitys/List-Letter-Template`,
      // },
      {
        icon: 'iconsminds-notepad',
        label: 'Offer Letter',
        menu: 'OfferLetter',
        to: `${this.adminRoot}/utilitys/List-Offer-Letter`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Joining Letter',
        menu: 'JoiningLetter',
        to: `${this.adminRoot}/utilitys/List-Joining-Letter`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Experience Letter',
        menu: 'ExperienceLetter',
        to: `${this.adminRoot}/utilitys/List-experience-Letter`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Increment Letter',
        menu: 'IncrementLetter',
        to: `${this.adminRoot}/utilitys/List-increment-Letter`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Termination Letter',
        menu: 'TerminationLetter',
        to: `${this.adminRoot}/utilitys/List-termination-Letter`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Appoinment Letter',
        menu: 'AppointmentLetter',
        to: `${this.adminRoot}/utilitys/appoinment`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Discrepancy Letter',
        menu: 'DiscrepancyLetter',
        to: `${this.adminRoot}/utilitys/List-Discrepancy-Letter`,
      },      
      {
        icon: 'iconsminds-notepad',
        label: 'Audit Logs',
        menu: 'AuditLog',
        to: `${this.adminRoot}/utilitys/audit-logs`,
      },

    ];


    this.ERP = [
      {
        icon: 'iconsminds-notepad',
        label: 'ERP Integration',
        menu: 'JoiningLetter',
        to: `${this.adminRoot}/utilitys/list_erpIntegration`,
      },
    ];
  }
}
