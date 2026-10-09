
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';
@Component({
    selector: 'app-add-erp-integration',
    templateUrl: './add-erp-integration.component.html',
    styleUrls: ['./add-erp-integration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddErpIntegrationComponent implements OnInit {
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
  databasefields: any = ['PageBreak'];
  allData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }
  ngOnInit(): void {
    this.getIPAddress();
    this.getcompany();
    // this.getFields();
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

  onSubmit() {
    if (!this.lettertemp.valid) {
      return;
    }
    let body = {
      erpName: this.lettertemp.value.ERPName,
      baseUrl: this.lettertemp.value.baseURl,
      companyMasterID: this.lettertemp.value.company,
      apiSecret: this.lettertemp.value.apiSecret,
      apiKey: this.lettertemp.value.apiKey,
      empCodeUrl: this.lettertemp.value.empCodeUrl,
      advanceExpenceUrl: this.lettertemp.value.syncEmployee,
      expenseUrl: this.lettertemp.value.expenseUrl,
      salarySyncUrl:this.lettertemp.value.salarySyncUrl,
      expenseHeadUrl:this.lettertemp.value.expenseHeadUrl
    };

    this.spinner.start('submit');
    this.api.callApi(this.constant.ADDERPINTEGRATION, body, 'POST', true, true, true).subscribe(
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
        this.spinner.stop('submit');
        this.handleCatchError(err.error.message);
      },
    );
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


}
