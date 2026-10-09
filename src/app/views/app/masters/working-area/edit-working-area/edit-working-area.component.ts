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
    selector: 'app-edit-working-area',
    templateUrl: './edit-working-area.component.html',
    styleUrls: ['./edit-working-area.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditWorkingAreaComponent implements OnInit {

  @ViewChild('editworkingarea') editworkingarea: NgForm;
  ipAddress: any;
  company: any = [];
  designationdata: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  formValue: any;
  divisiondata: any;
  workingAreaData: any;

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
    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }
  editdata() {
    const id = this.formValue.ListWorkingAreaComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETWORKINGAREABYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.workingAreaData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  getcompany() {
 
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('company');
      this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.company = res.data;

            this.spinner.stop('company');
          } else {
            this.handleError(res.message);
            this.spinner.stop('company');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('company');
        },
      );
    
  }

  onSubmit() {
    if (!this.editworkingarea.valid) {
      return;
    }

  
   const body = {
    workingAreaName: this.editworkingarea.value.workingAreaName,
    
    };

   
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATEWORKINGAREA + this.formValue.ListWorkingAreaComponent.id , body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/working_area']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('submit');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
