import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-dealer-plan',
    templateUrl: './edit-dealer-plan.component.html',
    styleUrls: ['./edit-dealer-plan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditDealerPlanComponent implements OnInit {
  @ViewChild('addsubadmin') addsubadmin: NgForm;

  adminRoot = environment.adminRoot;
  ipAddress: any;
  buttonState = '';
  buttonDisabled: Boolean = false;
  formValue: any;
  plandata: any;
  company_id: any;
  company: any = [];
  editData: any = [];
  finalcityid: any;
  countryid: any;
  state: any = [];
  city: any[];
  stateid: any;
  cityid: any;
  branchdata: any;
  country: any;
  allcomp: any;
  usertype: any;
  bankdata: any;
  bankMasterID: number;
  values: any[] = [];


  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.getIPAddress();
    this.getEditData();
  }

  onSubmit() {
    if (!this.addsubadmin.valid) {
      return;
    }

    const values = this.values
    .filter((e) => !e.isDeleted)
    .map((e) => ({
      featuresName: e.featuresName,
    }));

  let featuresString = values.map((item) => item.featuresName).join('<br>');

    const body = {
      planName: this.addsubadmin.value.planName,
      Description:this.addsubadmin.value.Description,
      numberOfEmployee:this.addsubadmin.value.numberOfEmployee,
      numberOfCompany:this.addsubadmin.value.numberOfCompany,
      features: featuresString,
      updateByIp: this.ipAddress,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.EDITDEALERPLAN + this.formValue.ListDealerPlanComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/superadminmenus/dealerplan']);

              this.buttonDisabled = false;
              this.buttonState = '';

            }, 3000);
          } else {
            this.handleError(res.message);
            this.buttonDisabled = false;
            this.buttonState = '';
          }
          this.spinner.stop('start');

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



  getEditData() {
    const id = this.formValue.ListDealerPlanComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.GETIDDEALERPLAN + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.plandata = res.data;
          
          if(this.plandata.features){
            this.values = this.plandata.features.replace(/^"|"$/g, '').split('<br>').map((item) => ({
              featuresName: item,
              isDeleted: false
            }));
          }
          this.spinner.stop('start');
        },
        (err) => {
          this.spinner.stop('start');
          this.handleError(err.error.message);
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

  removevalue(i: number) {
    this.values[i].isDeleted = true;
  }

  addvalue() {
    this.values.push({ featuresName: '', isDeleted: false });
  }
}
