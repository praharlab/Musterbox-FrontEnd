import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-employee-status',
    templateUrl: './employee-status.component.html',
    styleUrls: ['./employee-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeStatusComponent implements OnInit {
  @ViewChild('datefilter2') datefilter2: NgForm;
  company_id: string;
  body1 = {
    companyid: '',
    branch_id: '',
    date: '',
  };
  defaultValue2: {
    cName: any;
  };
  company: any;
  showloader: any = 'true';
  rows2: any = [];
  getid: any;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');

    this.getDashboardEmp(this.company_id);
    this.defaultValue2 = {
      cName: Number(this.company_id),
    };
  }

  // getcompany() {
  //   const body = {
  //     id: this.company_id,
  //   };
  //   this.spinner.start();
  //   this.api
  //     .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.company = res.data;
  //         this.spinner.stop();
  //       }
  //     });
  // }

  getDashboardEmp(id) {
    this.getid = id;    
    if (!id) {
      return;
    }
    this.api
      .callApi(this.constant.DASHBOARDEMPSTATUS + id, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows2 = res.data;
          this.showloader = 'false';
        }
      });
  }

  navigateToEmployeeData(): void {
    this.formValueStorageService.navigate(
      'EmployeeStatusComponent',
      this.getid,
      '/payrolls/employee_status',
      this.getid,
    );
  }
}
