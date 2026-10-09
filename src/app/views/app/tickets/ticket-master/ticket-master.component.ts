import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-ticket-master',
    templateUrl: './ticket-master.component.html',
    styleUrls: ['./ticket-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  TicketArray: any = [];
  adminRoot = environment.adminRoot;

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

    this.TicketArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'Ticket Dashboard',
        menu: 'TicketDashboard',
        to: `${this.adminRoot}/tickets/ticketDashboard`,
      },
      {
        icon: 'iconsminds-paper',
        label: 'Ticket',
        menu: 'Ticket',
        to: `${this.adminRoot}/tickets/listTicket`,
      },
      {
        icon: 'iconsminds-on-off-2',
        label: 'Ticket Category',
        menu: 'TicketCategory',
        to: `${this.adminRoot}/tickets/listTicketCategory`,
      },

      {
        icon: 'simple-icon-grid',
        label: 'Ticket Sub Category',
        menu: 'TicketSubcategory',
        to: `${this.adminRoot}/tickets/listTicketSubCategory`,
      },
      {
        icon: 'simple-icon-grid',
        label: 'Chat',
        menu: 'Chat',
        to: `${this.adminRoot}/tickets/chat`,
      },

      {
        icon: 'simple-icon-grid',
        label: 'All Tickets',
        menu: 'AllTicket',
        to: `${this.adminRoot}/tickets/all_tickets`,
      },

    ];
  }
}
