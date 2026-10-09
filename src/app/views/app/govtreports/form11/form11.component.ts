import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-form11',
    templateUrl: './form11.component.html',
    styleUrls: ['./form11.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Form11Component implements OnInit {
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
  employeedata: any;
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

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
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
              permissionval.formName == 'Form-11' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.finaldata = false;
      this.resultColumns = [];
      this.ngOnInit();
      this.rows = [];
    }, 100);
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

  selectbranch(id) {
    let bb = {
      branchMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeedata = res.data;
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    this.resultColumns = [];
    const body = {
      userMasterID: this.datefilter.value.userMasterID,
      createBy: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETFORM_11, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;

          let FullName =
            ' ' +
            this.rows.FirstName_capital +
            ' ' +
            this.rows.MiddleName_capital +
            ' ' +
            this.rows.LastName_capital;
          this.fullNameArray = Array.from(FullName);
          for (let i = this.fullNameArray.length - 1; i < 75; i++) {
            this.fullNameArray.push(' ');
          }

          let DOB = ' ' + this.rows.dob;
          this.dobArray = Array.from(DOB);

          let MiddleName = ' ' + this.rows.MiddleName_capital;
          this.middleNameArray = Array.from(MiddleName);
          for (let i = this.middleNameArray.length - 1; i < 74; i++)
            this.middleNameArray.push('  ');

          let MobileNumber = ' ' + this.rows.userNumber;
          this.mobileNumberArray = Array.from(MobileNumber);

          if (this.rows?.uanNumber === null) {
            this.uanNumberArray = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
          } else {
            this.uanNumberArray = Array.from(this.rows.uanNumber);
          }

          {
            this.rows?.email === null
              ? (this.emailArray = [])
              : (this.emailArray = Array.from(' ' + this.rows.email));
            for (let i = this.emailArray.length - 1; i < 74; i++) {
              this.emailArray.push('  ');
            }
          }
          this.spinner.stop();
          this.finaldata = true;
        }
        for (var key in this.rows[0]) {
          this.resultColumns.push({
            name: key,
            prop: key,
            flexGrow: 1.2,
            minWidth: 200,
          });
        }
      });
  }
}
