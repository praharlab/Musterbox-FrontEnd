import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-ticket-sub-category',
    templateUrl: './add-ticket-sub-category.component.html',
    styleUrls: ['./add-ticket-sub-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTicketSubCategoryComponent implements OnInit {
  @ViewChild('addTicketSubCategoty') addTicketSubCategoty: NgForm;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employee: any;
  ticketCategory: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

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
        this.company = res.data;
        this.spinner.stop();
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
        this.spinner.stop();
      });

    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETALLTICKETCATEGORY + '?companyMasterID=' + id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.ticketCategory = res.data;
        this.spinner.stop();
      });
  }

  onSubmit() {
    if (!this.addTicketSubCategoty.valid) {
      return;
    }

    let body = {
      name: this.addTicketSubCategoty.value.ticketsubCategoryName,
      description: this.addTicketSubCategoty.value.description,
      defaultAssignee: this.addTicketSubCategoty.value.user,
      ticketCategoryId: Number(this.addTicketSubCategoty.value.ticketCategoryId),
    };

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api
      .callApi(this.constant.CREATETICKETSUBCATEGORY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/tickets/listTicketSubCategory']);

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
