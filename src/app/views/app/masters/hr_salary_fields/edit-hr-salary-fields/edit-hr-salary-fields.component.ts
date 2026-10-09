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
    selector: 'app-edit-hr-salary-fields',
    templateUrl: './edit-hr-salary-fields.component.html',
    styleUrls: ['./edit-hr-salary-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditHrSalaryFieldsComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  company_id: any;
  product: any;
  hrsalaryfield: any;
  edithrsalaryfield: any;
  sqlreport: any;
  splreport: number;
  payhead: any;
  salaryFieldInactiveDate: any;
  monthname: any;
  payheadmonth: any = [];
  payheadeffect: any = [];
  effpayhead: any;
  isdisebled: boolean = false;
  childcompany: any;
  usertype: any;
  parentformdata: any;
  Form16ID: any;
  tostore = '';
  todisplay = '';
  calculation_on: any;
  calculatonType: any;
  percentage: any;
  effectepayhead: any;
  fix: any;
  adminRoot = environment.adminRoot;
  formValue: any;
  editable: boolean = true;

  nonEditableIds: any = [1, 50, 9, 16, 17, 24, 34, 43, 78, 83, 96, 97, 4, 5, 12, 13, 14, 25, 66, 99, 92,67,101];
  considerInValue: string = '';
  toShowConsiderIn: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getproduct();
    this.getIPAddress();
    this.getsalaryfields();
    this.editsalaryfields();
    this.allparentform();
    const vname = {
      viewName: 'ms_view_monthnamelist',
      where: '',
    };
    //get MonthView
    this.api
      .callApi(this.constant.commonview, vname, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.monthname = res.data;
          this.monthname.push({
            month: 'All',
            number: 0,
          });
          this.monthname.sort((a, b) => {
            return a.number - b.number;
          });
        }
      });
    const body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETALLPAYHEAD, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.payhead = res.data;
        }
      });
  }
  getproduct() {
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
            this.product = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
  }
  changePayhead(e: any) {
    const body = {
      page: '',
      limit: '',
      companyMasterID: e,
    };
    this.api
      .callApi(this.constant.GETCOMPANYPAYHEAD, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          var pdata = [];
          res.data.forEach((element) => {
            pdata.push(element.Payheadmaster);
          });
          this.effpayhead = pdata;
        }
      });
  }
  getsalaryfields() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETHRSALARYFIELSBYID + localStorage.getItem('company_id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.hrsalaryfield = res.data;
          this.grossConsider();

          this.spinner.stop();
        }
      });
  }

  grossConsider() {
    if (
      this.edithrsalaryfield.salaryFieldSrNo == 'A' &&
      this.edithrsalaryfield.salaryFieldShow == 'Y'
    ) {
      this.toShowConsiderIn = true;
    } else {
      this.toShowConsiderIn = false;
      this.considerInValue = null;
    }
  }

  editsalaryfields() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETHRSALARYFIELSBYID1 + this.formValue.ListHrSalaryFieldsComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.edithrsalaryfield = res.data;
          if (this.nonEditableIds.includes(this.edithrsalaryfield.payheadMasterId)) {
            this.editable = false;
           
          }

          this.considerInValue = this.edithrsalaryfield.considerIn;

          (this.todisplay = this.edithrsalaryfield.formula),
            (this.tostore = this.edithrsalaryfield.formulaID),
            this.edithrsalaryfield.salaryFieldWhenMonth.forEach((ele) => {
              this.payheadmonth.push(parseInt(ele));
            });
          this.edithrsalaryfield.salaryFieldAttanChk = JSON.stringify(
            this.edithrsalaryfield.salaryFieldAttanChk,
          );
          res.childData.forEach((ele) => {
            this.payheadeffect.push(ele.salaryFieldsEffect);
          });

          if (
            this.edithrsalaryfield.salaryFieldMaxAmt != null &&
            this.payheadeffect.length == 0 &&
            this.edithrsalaryfield.salaryFieldDefaultPer == null &&
            this.edithrsalaryfield.formula == null
          ) {
            this.calculatonType = 'F';
          } else if (
            this.edithrsalaryfield.formula != null &&
            this.payheadeffect.length == 0 &&
            this.edithrsalaryfield.salaryFieldDefaultPer == null &&
            this.edithrsalaryfield.salaryFieldMaxAmt == null
          ) {
            this.calculatonType = 'FO';
          } else {
            this.calculatonType = '';
          }

          this.calculation_on = this.calculatonType;

          // this.addcomp.value.salaryFieldWhenMonth=this.edithrsalaryfield.salaryFieldWhenMonth;
          const body = {
            page: '',
            limit: '',
            companyMasterID: this.edithrsalaryfield.companyMasterID,
          };
          this.api
            .callApi(this.constant.GETCOMPANYPAYHEAD, body, 'POST', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                var pdata = [];
                res.data.forEach((element) => {
                  pdata.push(element);
                });
                this.effpayhead = pdata;
              }
            });

          this.spinner.stop();
        }
      });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    let body = {};
    if (this.childcompany == 'true') {
      body = {
        salaryFieldID: this.edithrsalaryfield.salaryFieldID,
        payheadMasterId: this.edithrsalaryfield.payheadMasterId,
        salaryFieldIndex: this.addcomp.value.salaryFieldIndex,
        salaryFieldSide: this.edithrsalaryfield.salaryFieldSide,
        salaryFieldAttanChk: this.addcomp.value.salaryFieldAttanChk,
        salaryFieldMaxAmt: this.fix,
        salaryFieldWhenMonth: this.addcomp.value.salaryFieldWhenMonth,
        salaryFieldDefaultPer: this.percentage,
        salaryFieldMaxAmtAdj: this.addcomp.value.salaryFieldMaxAmtAdj,
        salaryFieldRound: this.edithrsalaryfield.salaryFieldRound,
        salaryFieldRoundNo: this.edithrsalaryfield.salaryFieldRoundNo,
        salaryFieldShow: this.edithrsalaryfield.salaryFieldShow,
        salaryFieldSrNo: this.edithrsalaryfield.salaryFieldSrNo,
        roundOffType:
          this.addcomp.value.salaryFieldRound == 'Y' ? this.addcomp.value.roundOffType : null,
        salaryFieldMaxRange: this.addcomp.value.salaryFieldMaxRange,
        companyMasterID: this.edithrsalaryfield.companyMasterID,
        salaryFieldsEffect: this.effectepayhead,
        payheadDisplayName: this.addcomp.value.payheadDisplayName,

        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
        formula: this.todisplay,
        formulaID: this.tostore,
        considerIn:
          this.edithrsalaryfield.salaryFieldSrNo == 'A' &&
            this.edithrsalaryfield.salaryFieldShow == 'Y'
            ? this.considerInValue
            : null,
      };
    } else {
      body = {
        salaryFieldID: this.edithrsalaryfield.salaryFieldID,
        payheadMasterId: this.edithrsalaryfield.payheadMasterId,
        salaryFieldIndex: this.addcomp.value.salaryFieldIndex,
        salaryFieldSide: this.edithrsalaryfield.salaryFieldSide,
        salaryFieldAttanChk: this.addcomp.value.salaryFieldAttanChk,
        salaryFieldMaxAmt: this.fix,
        salaryFieldWhenMonth: this.addcomp.value.salaryFieldWhenMonth,
        salaryFieldDefaultPer: this.percentage,
        salaryFieldMaxAmtAdj: this.addcomp.value.salaryFieldMaxAmtAdj,
        salaryFieldRound: this.edithrsalaryfield.salaryFieldRound,
        salaryFieldRoundNo:
          this.addcomp.value.salaryFieldRound == 'N' ? this.addcomp.value.salaryFieldRoundNo : null,
        salaryFieldShow: this.edithrsalaryfield.salaryFieldShow,
        salaryFieldSrNo: this.edithrsalaryfield.salaryFieldSrNo,
        roundOffType:
          this.addcomp.value.salaryFieldRound == 'Y' ? this.addcomp.value.roundOffType : null,
        salaryFieldMaxRange: this.addcomp.value.salaryFieldMaxRange,
        companyMasterID: this.edithrsalaryfield.companyMasterID,
        salaryFieldsEffect: this.effectepayhead,
        payheadDisplayName: this.addcomp.value.payheadDisplayName,
        updateBy: localStorage.getItem('id'),
        updateByIp: this.ipAddress,
        formula: this.todisplay,
        formulaID: this.tostore,
        considerIn:
          this.edithrsalaryfield.salaryFieldSrNo == 'A' &&
            this.edithrsalaryfield.salaryFieldShow == 'Y'
            ? this.considerInValue
            : null,
      };
    }
    this.isdisebled = true;
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEHRFIELDS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/hr_field_salary']);

            this.spinner.stop();
            this.isdisebled = false;
          }, 3000);
        } else {
          this.isdisebled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.isdisebled = false;
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
  allparentform() {
    const filterData = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETCHILDFORM16, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.parentformdata = res.data;
          this.spinner.stop();
        }
      });
  }

  // getCalculation() {

  // }

  // selectCal(event) {
  //   this.calculation_on = event;

  // }

  // addpayhead(event, eventid) {
  //   if (this.todisplay == null) {
  //     this.todisplay = ''
  //   }
  //   if (this.tostore == null) {
  //     this.tostore = ''
  //   }

  //   this.todisplay = this.todisplay + String(event)
  //   this.tostore = String(this.tostore) + String(eventid)
  // }

  // clearAll() {
  //   this.todisplay = '';
  //   this.tostore = '';

  // }

  // clearText() {

  //   this.todisplay = this.todisplay.slice(0, -1);
  //   this.tostore = this.tostore.slice(0, -1);

  // }
}
