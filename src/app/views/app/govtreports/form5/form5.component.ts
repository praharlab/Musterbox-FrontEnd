import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-form5',
    templateUrl: './form5.component.html',
    styleUrls: ['./form5.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form5Component implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  apiURL = environment.apiUrl;
  permissionview: any;
  finaldata: boolean = false;
  company_id: any;
  scrollBarHorizontal: boolean;
  company1: any;
  company12: any;
  companyData: any;
  branch: any;
  fromMonth: any;
  toMonth: any;
  currentTime: any;
  newcurrentTime: any;
  rows: any = [];
  result: any;
  result1: any;
  company: any;
  companydata: any;
  Branch: any;
  selectedCompanyId: any;
  resultColumns: any[];
  employee: any;
  allbranch: any;
  // employeedata: any =[];
  fullNameArray: any[];
  dobArray: any[];
  middleNameArray: any[];
  mobileNumberArray: any[];
  uanNumberArray: any[];
  emailArray: any[];
  bankAccountNoArray: any[];
  adharCardArray: any[];
  pancardArray: any[];
  branch_cityArray: any[];
  esicNumberArray: any[];
  windowsize: boolean;
  websitePageWidth: any;
  websitePageHeight: number;
  selectedCompanyID: any;
  userArray: any = [];
  display: boolean;
  professionalTaxSlabMasters_Userdata: any;
  calculated_data: any;
  professionalTaxSlabMasters_data: any;
  totalData: any;
  state: any;
  branchPTNumber: any;
  monthYearOfReport: any;
  companyName_address: any;
  companyName_place: any;
  stateName: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.getAllState();
    let currentTime = new Date();
    const a = currentTime.getFullYear();
    const b = currentTime.getMonth() + 1;
    const c = currentTime.getDate();

    this.newcurrentTime = c + '-' + b + '-' + a;
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
          this.company1 = res.data;

          this.spinner.stop();
        }
      });
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Form-5' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  clear() {
    this.employee = [];
    this.allbranch = [];
    // this.employeedata = [];
    this.professionalTaxSlabMasters_Userdata = [];
    this.calculated_data = [];
    this.professionalTaxSlabMasters_data = [];
    this.totalData = [];
    this.display = false;
    this.datefilter.resetForm();
    this.state = [];
    this.finaldata = false;
  }

  selectcompany(id) {
    if (!id) {
      let bb = {
        page: '',
        limit: '',
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
          }
        });

      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + this.company_id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop();
        });
    } else {
      this.employee = [];
      this.allbranch = [];
      // this.employeedata = [];
      this.professionalTaxSlabMasters_Userdata = [];
      this.calculated_data = [];
      this.professionalTaxSlabMasters_data = [];
      this.totalData = [];
      this.display = false;

      this.selectedCompanyID = id;
      let bb = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
          }
        });

      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop();
        });
    }
  }

  getAllState() {
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + 103, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
        },
        (err) => {
          console.log('error', err);
        },
      );
  }

  // selectbranch(id) {

  //   this.professionalTaxSlabMasters_Userdata = []
  //   this.calculated_data = []
  //   this.professionalTaxSlabMasters_data = []
  //   this.totalData = []
  //   this.display = false

  //   let bb = {
  //     branchMasterID: id,
  //   }
  //   this.spinner.start()
  //   this.api
  //     .callApi(
  //       this.constant.GETALLUSERS,
  //       bb,
  //       'POST',
  //       true,
  //       false,
  //       true,
  //     )
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.employeedata = res.data
  //         this.spinner.stop()
  //       }
  //     })
  // }

  selectfromyearmonth($event) {
    this.monthYearOfReport = [];
    this.companyName_address = [];
    this.branchPTNumber = [];
    this.totalData = [];
    this.calculated_data = [];
    this.display = false;
  }

  selectstate($event) {
    this.display = false;
    this.monthYearOfReport = [];
    this.companyName_address = [];
    this.branchPTNumber = [];
    this.totalData = [];
    this.calculated_data = [];
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    for (var i = 0; i < this.state.length; i++) {
      if (this.state[i].stateMasterID == this.datefilter.value.state1) {
        this.stateName = this.state[i].stateName;
        break;
      }
    }

    let startyear = this.datefilter.value.fromyearmonth.slice(0, 4);
    let startmonth = this.datefilter.value.fromyearmonth.slice(5, 7);

    let startyearmonth = startyear.concat(startmonth);

    // for (var i = 0; i < this.employeedata.length; i++) {
    //   this.userArray.push(this.employeedata[i].userMasterID)
    // }

    this.resultColumns = [];
    const body = {
      companyMasterID: this.selectedCompanyID,
      yearmonth: Number(startyearmonth),
      // month:Number(startmonth) ,
      // userid : this.userArray,
      stateId: this.datefilter.value.state1,
    };

    this.api
      .callApi(this.constant.GETFORM_5, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.calculated_data = res.professionalTaxSlabMasters_data;
          this.totalData = res.calculated_data;

          let branchPTnumber = res.branchPTnumber;
          this.branchPTNumber = branchPTnumber;

          this.companyName_address = res.companyName_address;

          this.companyName_place = this.companyName_address['cityMaster.cityName'];

          this.monthYearOfReport = res.monthYearOfReport;
          this.finaldata = true;
          this.display = true;
        }
      });
  }
}
