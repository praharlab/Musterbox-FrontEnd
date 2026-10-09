import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-add-hr-salary-fields',
    templateUrl: './add-hr-salary-fields.component.html',
    styleUrls: ['./add-hr-salary-fields.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddHrSalaryFieldsComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('effectedpayhead12') effectedpayhead12: Text;

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
  salaryFieldInactiveDate: any;
  finalSettlement: any;
  payhead: any;
  effpayhead: any;
  monthname: any;
  isdisebled: boolean = false;
  childcompany: any;
  usertype: any;
  parentformdata: any;
  Form16ID: any;
  index: any;
  effectedpayhead: any;
  calculation_on: any;
  formula: any;
  payheadName: any;
  todisplay = '';
  tostore = '';
  adminRoot = environment.adminRoot;
  considerInValue: string = ''
  toShowConsiderIn: boolean = false

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getproduct();
    this.getIPAddress();
    this.getsalaryfields();
    this.allparentform();
    const vname = {
      viewName: 'ms_view_monthnamelist',
      where: '',
    };

    this.changePayhead(this.company_id);
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
            pdata.push(element);
          });
          this.effpayhead = pdata;
        }
      });
    const body1 = {
      companyMasterID: e,
    };
    this.api
      .callApi(this.constant.GETINDEX, body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.index = res.data.index;
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

          this.spinner.stop();
        }
      });
  }

  grossConsider() {
    if (this.addcomp.value.salaryFieldSrNo == 'A' && this.addcomp.value.salaryFieldShow == 'Y') {
      this.toShowConsiderIn = true;
    }else{
      this.toShowConsiderIn = false;
      this.considerInValue = null
    }
  }


  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
   
    this.isdisebled = true;
    let body = {};
    if (this.childcompany == 'true') {
      body = {
        payheadMasterId: this.addcomp.value.payheadMasterId,
        salaryFieldIndex: this.addcomp.value.salaryFieldIndex,
        salaryFieldSide: this.addcomp.value.salaryFieldSide,
        salaryFieldAttanChk: this.addcomp.value.salaryFieldAttanChk,
        salaryFieldMaxAmt:
          this.addcomp.value.salaryFieldMaxAmt == undefined
            ? null
            : this.addcomp.value.salaryFieldMaxAmt,
        salaryFieldWhenMonth: this.addcomp.value.salaryFieldWhenMonth,
        salaryFieldDefaultPer:
          this.addcomp.value.salaryFieldDefaultPer == undefined
            ? null
            : this.addcomp.value.salaryFieldDefaultPer,
        formula: this.addcomp.value.formula == undefined ? null : this.addcomp.value.formula,
        formulaID: this.tostore == '' ? null : this.tostore,
        salaryFieldRound: this.addcomp.value.salaryFieldRound,
        salaryFieldRoundNo: this.addcomp.value.salaryFieldRoundNo,
        salaryFieldShow: this.addcomp.value.salaryFieldShow,
        salaryFieldSrNo: this.addcomp.value.salaryFieldSrNo,
        roundOffType: this.addcomp.value.salaryFieldRound == 'Y' ? this.addcomp.value.roundOffType : null,
        salaryFieldMaxRange: this.addcomp.value.salaryFieldMaxRange,
        companyMasterID: this.company_id,
        salaryFieldsEffect:
          this.addcomp.value.effectedpayhead == undefined ? '' : this.addcomp.value.effectedpayhead,
        payheadDisplayName: this.addcomp.value.payheadDisplayName,
        considerIn:this.addcomp.value.salaryFieldSrNo == 'A' && this.addcomp.value.salaryFieldShow == 'Y'?this.considerInValue:null,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        payheadMasterId: this.addcomp.value.payheadMasterId,
        salaryFieldIndex: this.addcomp.value.salaryFieldIndex,
        salaryFieldSide: this.addcomp.value.salaryFieldSide,
        salaryFieldAttanChk: this.addcomp.value.salaryFieldAttanChk,
        salaryFieldMaxAmt:
          this.addcomp.value.salaryFieldMaxAmt == undefined
            ? null
            : this.addcomp.value.salaryFieldMaxAmt,
        salaryFieldWhenMonth: this.addcomp.value.salaryFieldWhenMonth,
        salaryFieldDefaultPer:
          this.addcomp.value.salaryFieldDefaultPer == undefined
            ? null
            : this.addcomp.value.salaryFieldDefaultPer,
        formula: this.addcomp.value.formula == undefined ? null : this.addcomp.value.formula,
        formulaID: this.tostore == '' ? null : this.tostore,
        salaryFieldRound: this.addcomp.value.salaryFieldRound,
        salaryFieldRoundNo: this.addcomp.value.salaryFieldRound == 'N' ? this.addcomp.value.salaryFieldRoundNo : null,
        salaryFieldShow: this.addcomp.value.salaryFieldShow,
        salaryFieldSrNo: this.addcomp.value.salaryFieldSrNo,
        roundOffType: this.addcomp.value.salaryFieldRound == 'Y' ? this.addcomp.value.roundOffType : null,
        salaryFieldMaxRange: this.addcomp.value.salaryFieldMaxRange,
        companyMasterID: this.addcomp.value.companyMasterID,
        salaryFieldsEffect:
          this.addcomp.value.effectedpayhead == undefined ? '' : this.addcomp.value.effectedpayhead,
        payheadDisplayName: this.addcomp.value.payheadDisplayName,
        considerIn:this.addcomp.value.salaryFieldSrNo == 'A' && this.addcomp.value.salaryFieldShow == 'Y'?this.considerInValue:null,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }


    this.spinner.start();
    this.api.callApi(this.constant.CREATEHRFIELDS, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.isdisebled = false;
            this.router.navigate([this.adminRoot + '/masters/hr_field_salary']);
            this.spinner.stop();
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

  // selectCal(event) {

  //   this.calculation_on = event;

  // }

  // addpayhead(event, eventid) {

  //   this.todisplay = this.todisplay + String(event)
  //  this.tostore = String(this.tostore) + String(eventid)
  // }

  // clearAll() {
  //   this.todisplay = '';
  //   this.tostore = '';

  // }

  // clearText(){

  //   this.todisplay  = this.todisplay.slice(0,-1);
  //   this.tostore  = this.tostore.slice(0,-1);

  // }
}
