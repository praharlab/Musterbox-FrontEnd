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
    selector: 'app-add-division',
    templateUrl: './add-division.component.html',
    styleUrls: ['./add-division.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddDivisionComponent implements OnInit {

  @ViewChild('adddivision') adddivision: NgForm;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getIPAddress();
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

  onSubmit() {
    if (!this.adddivision.valid) {
      return;
    }
   
   const body = {
      divisionName: this.adddivision.value.divisionName,
      companyMasterID: this.adddivision.value.companyMasterID,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start('add');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.ADDDIVISION, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/division']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('add');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

}
