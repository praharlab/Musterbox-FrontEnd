import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-ticket-category',
    templateUrl: './add-ticket-category.component.html',
    styleUrls: ['./add-ticket-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTicketCategoryComponent implements OnInit {
  @ViewChild('addTicketCategoty') addTicketCategoty: NgForm;
  ipAddress: any;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employee: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');

    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    if (!id) {
      return;
    }
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
        }
      });
  }

  onSubmit() {
    if (!this.addTicketCategoty.valid) {
      return;
    }

    let body = {
      name: this.addTicketCategoty.value.ticketCategoryName,
      description: this.addTicketCategoty.value.description,
      companyMasterID: this.addTicketCategoty.value.companyMasterID,
      defaultAssignee: this.addTicketCategoty.value.user,
    };

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.CREATETICKETCATEGORY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.notifications.create('Done', res.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: true,
        });
        setTimeout(() => {
          this.router.navigate([this.adminRoot + '/tickets/listTicketCategory']);

          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
        }, 3000);
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('start');
      },
    );
  }
}
