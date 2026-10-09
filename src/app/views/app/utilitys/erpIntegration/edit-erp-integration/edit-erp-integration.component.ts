import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-erp-integration',
    templateUrl: './edit-erp-integration.component.html',
    styleUrls: ['./edit-erp-integration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditErpIntegrationComponent implements OnInit {
  @ViewChild('lettertemp') lettertemp: NgForm;
  adminRoot = environment.adminRoot;

  ipAddress: any;
  company1: any;
  permissiondelete: any;
  permissionedit: any;
  permissionview: any;
  permissioncreate: any;
  fields: boolean;
  letterfields: any = [];
  databasefields: any = ["PageBreak"]

  erpdata: any;
  formValue: any;
  allData: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) { }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        } else {
          this.handleCatchError('something went weong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.spinner.stop('company');
        this.handleCatchError(err.error.message);
      },
    );
  }

  editdata() {
    const id = this.formValue.ListErpIntegrationComponent.id

    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETERPINTEGRATIONID + id, {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.erpdata = res.data;
          this.spinner.stop('data');
        },
        (err) => {
          this.handleCatchError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  onSubmit() {
    if (!this.lettertemp.valid) {
      return;
    }
    let body = {
      erpName: this.lettertemp.value.ERPName,
      baseUrl: this.lettertemp.value.baseURl,
      companyMasterID: this.lettertemp.value.company,
      updateByIp: this.ipAddress,
      apiSecret: this.lettertemp.value.apiSecret,
      apiKey: this.lettertemp.value.apiKey,
      empCodeUrl: this.lettertemp.value.empCodeUrl,
      advanceExpenceUrl: this.lettertemp.value.syncEmployee,
      expenseUrl: this.lettertemp.value.expenseUrl,
      salarySyncUrl:this.lettertemp.value.salarySyncUrl,
      expenseHeadUrl:this.lettertemp.value.expenseHeadUrl
    };

    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATEERPINTEGRATION + this.formValue.ListErpIntegrationComponent.id, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/utilitys/list_erpIntegration']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.handleCatchError(err.error.message);
        this.spinner.stop('submit');
      },
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }




}

