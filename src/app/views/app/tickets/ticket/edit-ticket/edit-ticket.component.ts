import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-ticket',
    templateUrl: './edit-ticket.component.html',
    styleUrls: ['./edit-ticket.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTicketComponent implements OnInit {
  @ViewChild('editTicket') editTicket: NgForm;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employee: any;
  ticketCategory: any = [];
  ticketSubCategory: any = [];
  file: any;
  file1: any = '';
  url: any;
  editData: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');
    this.getEditData();
    this.getTicketCategory();
    this.getEmployee();
  }

  getEditData() {
    let id = this.formValue.ListTicketComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.GETONETICKET + id, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data) {
          this.editData = res.data;
          this.selectTicketCategory(this.editData.ticketCategoryId);
          // this.editData.attachments = this.editData.attachments.replace(/\\/g, '/');
        }

        this.spinner.stop('start');
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('start');
      },
    );
  }

  getTicketCategory() {
    this.spinner.start();

    this.api.callApi(this.constant.GETALLTICKETCATEGORY, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        this.ticketCategory = res.data;

        this.spinner.stop();
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  selectTicketCategory(id) {
    if (!id) {
      return;
    }
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETALLTICKETSUBCATEGORY + '?ticketCategoryId=' + id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.ticketSubCategory = res.data;
        this.spinner.stop();
      });
  }

  getEmployee() {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
        }
        this.spinner.stop('start');
      });
  }

  view(img: any) {
    window.open(this.apiURL + 'uploads/center/' + img, '_blank');
  }

  onSubmit() {
    if (!this.editTicket.valid) {
      return;
    }

    let body = {
      title: this.editTicket.value.title,
      description: this.editTicket.value.description,
      ticketCategoryId: this.editTicket.value.ticketCategoryID,
      ticketSubCategoryId: this.editTicket.value.ticketSubCategoryId,
      priority: this.editTicket.value.priority,
      status: this.editTicket.value.status,
      assignee: this.editTicket.value.user,
    };

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATETICKET + this.formValue.ListTicketComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/tickets/listTicket']);

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
