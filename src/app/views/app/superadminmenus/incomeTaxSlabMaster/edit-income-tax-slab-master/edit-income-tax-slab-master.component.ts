import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-income-tax-slab-master',
    templateUrl: './edit-income-tax-slab-master.component.html',
    styleUrls: ['./edit-income-tax-slab-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditIncomeTaxSlabMasterComponent implements OnInit {
  @ViewChild('editform') editform: NgForm;
  scrollBarHorizontal: boolean;
  usertype: any;
  permissioncreate: number[];
  genderArray: string[];
  regimeArray: string[];
  fyarray: string[];
  ipAddress: any;
  incomeTaxSlabMasterData: any = [];
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    if (this.usertype == 2) {
      this.permissioncreate = [1];
    }

    this.genderArray = ['Male', 'Female'];
    this.regimeArray = ['New Regime', 'Old Regime'];
    this.getFinancialYears();
    this.getIPAddress();
    this.getDataById();
  }

  getFinancialYears() {
    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.fyarray = res.data;
        }
        this.spinner.stop('financialyear');
      },
      (err) => {
        this.spinner.stop('financialyear');
      },
    );
  }

  getDataById() {
    // let id = this.formValue.ListIncomeTaxSlabMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETBYIDINCOMETAXSLABMASTER + this.formValue.ListIncomeTaxSlabMasterComponent.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.incomeTaxSlabMasterData = res.data;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
        },
      );
  }

  onSubmit() {
    if (!this.editform.valid) {
      return;
    }
    const body = {
      assessmentYear: this.editform.value.assessmentYear,
      gender: this.editform.value.gender,
      regime: this.editform.value.regime,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(
        this.constant.UPDATEINCOMETAXSLABMASTER + this.formValue.ListIncomeTaxSlabMasterComponent.id,
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
              this.router.navigate([this.adminRoot + '/superadminmenus/list_incomeTaxSlabMaster']);
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
