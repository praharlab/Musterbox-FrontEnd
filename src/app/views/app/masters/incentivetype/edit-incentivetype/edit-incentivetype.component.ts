import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-incentivetype',
    templateUrl: './edit-incentivetype.component.html',
    styleUrls: ['./edit-incentivetype.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditIncentivetypeComponent implements OnInit {
  @ViewChild('filterform') filterform: NgForm;
  ipAddress: any;
  allcomp: any;
  company: any;
  childcompany: string;
  usertype: any;
  companyName: string;
  company_id: any;
  datashow: boolean;
  companydata: any;
  cons: any;
  nets: any;
  showPFESIC: boolean = false;
  adminRoot = environment.adminRoot;
  formValue: any;
  employeeESICPercentage: number = 0.75;
  employerESICPercentage: number = 3.25;
  nonEditableList = ['attendance bonus','food allowance','tea/coffee allowance','extra days']


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private sant: DomSanitizer,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getcompany();
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.companyName = localStorage.getItem('company_id');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.editdata();
  }
  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: localStorage.getItem('company_id'),
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  editdata() {
    let IncentivetypeID = this.formValue.ListIncentivetypeComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBYIDINCENTIVE + IncentivetypeID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          this.companydata.companyMasterID = Number(this.companydata.companyMasterID);
          if (this.companydata.showinsalaryslip == 'false') {
            this.companydata.showinsalaryslip = false;
            this.datashow = false;
            this.showPFESIC = false;
          } else {
            this.companydata.showinsalaryslip = true;
            this.datashow = true;

            if (this.companydata.consider == 'gross') {
              this.showPFESIC = true;
            }
          }
          if (this.companydata.show == 'show') {
            this.cons = 'show';
            this.nets = 'show';
          } else {
            this.cons = 'net';
            this.nets = 'net';
          }

          if (this.companydata.esicApplicable == 'true') this.companydata.esicApplicable = true;

          this.employeeESICPercentage = this.companydata.employeeESICPer || 0.75;
          this.employerESICPercentage = this.companydata.employerESICPer || 3.25;

          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }
  onSubmit() {
    if (!this.filterform.valid) {
      return;
    }

    if (
      this.employeeESICPercentage < 0 ||
      this.employeeESICPercentage > 100 ||
      this.employerESICPercentage < 0 ||
      this.employerESICPercentage > 100
    ) {
      return this.notifications.create(
        'Invalid ESIC Percentage',
        'Please enter an ESIC percentage between 0 and 100 for both employee and employer contributions.',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
    }

    if (!this.filterform.value.show) {
      this.filterform.value.show = null;
      this.filterform.value.showinsalaryslip = false;
    }

    if (this.showPFESIC == false) {
      this.filterform.value.pfApplicable = null;
      this.filterform.value.esicApplicable = null;
    }

    if (this.filterform.value.pfApplicable == '') {
      this.filterform.value.pfApplicable = null;
    }

    if (this.filterform.value.esicApplicable == '') {
      this.filterform.value.esicApplicable = null;
    }

    let body = {
      IncentivetypeID: this.formValue.ListIncentivetypeComponent.id,
      incentivetypename: this.filterform.value.incentivetypename,
      inc_type_displayName:this.companydata.inc_type_displayName,
      createBy: localStorage.getItem('id'),
      showinsalaryslip: this.filterform.value.showinsalaryslip,
      consider: this.filterform.value.show,
      status: this.filterform.value.status,
      companyMasterID: this.companydata.companyMasterID,
      createByIp: this.ipAddress,
      pfApplicable: this.filterform.value.pfApplicable,
      esicApplicable: this.filterform.value.esicApplicable,
      employeeESICPer: this.filterform.value.esicApplicable ? this.employeeESICPercentage : null,
      employerESICPer: this.filterform.value.esicApplicable ? this.employerESICPercentage : null,
    };
    this.spinner.start('edit');
    this.api.callApi(this.constant.INCENTIVETYPEUPDATE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/list-incentivetype']);
            this.spinner.stop('edit');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('edit');
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('edit');
      },
    );
  }

  calltoshow(event) {
    if (event.target.checked == true) {
      this.datashow = true;
    } else {
      this.datashow = false;
      this.showPFESIC = false;

      this.filterform.value.pfApplicable = null;
      this.filterform.value.esicApplicable = null;
    }
  }

  applicablePFESIC(event) {
    if (event.target.value == 'gross') {
      this.showPFESIC = true;
    } else {
      this.showPFESIC = false;
      this.filterform.value.pfApplicable = null;
      this.filterform.value.esicApplicable = null;
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
