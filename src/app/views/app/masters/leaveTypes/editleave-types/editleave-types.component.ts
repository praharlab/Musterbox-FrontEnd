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
    selector: 'app-editleave-types',
    templateUrl: './editleave-types.component.html',
    styleUrls: ['./editleave-types.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditleaveTypesComponent implements OnInit {
  @ViewChild('addleavetype') addleavetype: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  leaveMaster: any;
  leavetypedata: any;
  isdisabled: boolean = false;
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

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getCompany();
    this.getLeaveMaster();
    this.editdata();
  }

  editdata() {
    let leavetypeid = this.formValue.ListleaveTypesComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETLEAVETYPESBYID + '/' + leavetypeid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.leavetypedata = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  getLeaveMaster() {
    this.spinner.start();
    const bb = {
      limit: '',
      page: '',
    };
    this.spinner.start();
    this.api.callApi(this.constant.GETALLLEAVEMASTER, bb, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.leaveMaster = res.data;

        this.spinner.stop();
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

  getCompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('company');

      this.api.callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true).subscribe(
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
    } else {
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
  }

  onSubmit() {
    if (!this.addleavetype.valid) {
      return;
    }
    this.isdisabled = true;
    let body = {
      LeaveTranId: this.formValue.ListleaveTypesComponent.id,
      LeaveID: this.addleavetype.value.LeaveID,
      SortIndex: this.addleavetype.value.SortIndex,
      Allow_On_H: this.addleavetype.value.Allow_On_H,
      Leave_Max_Days: this.addleavetype.value.Leave_Max_Days,
      // Leave_Elegibility_Days:this.addleavetype.value.Leave_Elegibility_Days,
      // Leave_per_Days:this.addleavetype.value.Leave_per_Days,
      Leave_CF: this.addleavetype.value.Leave_CF,
      Leave_Allow: this.addleavetype.value.Leave_Allow,
      // Eff_Total: this.addleavetype.value.Eff_Total,
      // Allow_Field_Entry: this.addleavetype.value.Allow_Field_Entry,
      companyMasterID: this.addleavetype.value.companyMasterID,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATELEAVETYPES, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          setTimeout(() => {
            this.isdisabled = false;
            this.router.navigate([this.adminRoot + '/masters/leavetypes']);
            this.spinner.stop('submit');
          }, 3000);

        } else {
          this.isdisabled = false;
          this.handleError(res.message);
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.isdisabled = false;
        this.handleError(err.error.message);
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
