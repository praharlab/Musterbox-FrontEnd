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
    selector: 'app-edit-ticket-sub-category',
    templateUrl: './edit-ticket-sub-category.component.html',
    styleUrls: ['./edit-ticket-sub-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTicketSubCategoryComponent implements OnInit {
  @ViewChild('editTicketSubCategoty') editTicketSubCategoty: NgForm;
  ipAddress: any;
  company: any = [];
  editData: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  employee: any;
  ticketCategory: any = [];
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.editdata();
  }
  editdata() {
    let id = this.formValue.ListTicketSubCategoryComponent.id;
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETONETICKETSUBCATEGORY + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.editData = res.data;
            // this.editData.ticketCategoryId = Number(res.data.ticketCategoryId)
            this.getEmployee(this.editData.ticketCategory.companyMasterId);
            this.getTicketCategory(this.editData.ticketCategory.companyMasterId);
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

  getEmployee(id) {
    if (!id) {
      return;
    }
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
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

  getTicketCategory(id) {
    if (!id) {
      return;
    }
    this.spinner.start('start');
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
        this.spinner.stop('start');
      });
  }

  onSubmit() {
    if (!this.editTicketSubCategoty.valid) {
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    let body = {
      name: this.editTicketSubCategoty.value.ticketsubCategoryName,
      description: this.editTicketSubCategoty.value.description,
      ticketCategoryId: this.editTicketSubCategoty.value.ticketCategoryId,
      defaultAssignee: this.editTicketSubCategoty.value.user,
    };

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATETICKETSUBCATEGORY + this.formValue.ListTicketSubCategoryComponent.id,
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
            this.router.navigate([this.adminRoot + '/tickets/listTicketSubCategory']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('start');
          }, 3000);
        },
        (err) => {
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

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop('start');
        }
      });
  }
}
