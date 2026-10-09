import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
    selector: 'app-add-incentivetype',
    templateUrl: './add-incentivetype.component.html',
    styleUrls: ['./add-incentivetype.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddIncentivetypeComponent implements OnInit {
  @ViewChild('filterform') filterform: NgForm;
  ipAddress: any;
  allcomp: any;
  company: any;
  childcompany: string;
  usertype: any;
  companyName: string;
  company_id: any;
  datashow: boolean;
  users: any;
  yes: any;
  no: any;
  purpose1: any;
  hide: any;
  event: any;
  showPFESIC: boolean = false;
  adminRoot = environment.adminRoot;
  employeeESICPercentage: number = 0.75;
  employerESICPercentage: number = 3.25;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    private sant: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.getcompany();
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.companyName = localStorage.getItem('company_id');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
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
      incentivetypename: this.filterform.value.incentivetypename,
      createBy: localStorage.getItem('id'),
      showinsalaryslip: this.filterform.value.showinsalaryslip,
      consider: this.filterform.value.show,
      status: this.filterform.value.status,
      companyMasterID: this.filterform.value.companyName,
      createByIp: this.ipAddress,
      pfApplicable: this.filterform.value.pfApplicable,
      esicApplicable: this.filterform.value.esicApplicable,
      employeeESICPer: this.filterform.value.esicApplicable ? this.employeeESICPercentage : null,
      employerESICPer: this.filterform.value.esicApplicable ? this.employerESICPercentage : null,
    };
    this.spinner.start();
    this.api.callApi(this.constant.INCENTIVETYPEADD, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/list-incentivetype']);

            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
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

  calltoshow(event) {
    if (event.target.checked == true) {
      this.datashow = true;
    } else {
      this.showPFESIC = false;
      this.datashow = false;
    }
  }

  applicablePFESIC(event) {
    if (event.target.value == 'gross') {
      this.showPFESIC = true;
    } else {
      this.showPFESIC = false;
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
