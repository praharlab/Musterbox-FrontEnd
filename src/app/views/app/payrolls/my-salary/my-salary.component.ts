import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-my-salary',
    templateUrl: './my-salary.component.html',
    styleUrls: ['./my-salary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MySalaryComponent implements OnInit {

  salarydata: any;
  permissionview: any = [];
  allStructure = []
  salaryData: any = [];
  userId: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    this.checkpermission();
    this.getAllStructure();
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
              permissionval.formName == 'MyPay' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getAllStructure() {
    this.spinner.start('salary');
    this.api
      .callApi(
        this.constant.GETALLSALARYSTRUCTUREBYUSERID + `?userMasterID=${this.userId}`,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allStructure = res.data;
          // this.allStructure.map(e => {
          //   if (e[0].baseOnCalculation == 'M') {
          //     e.map((s => {
          //       s.yearlyAmount = +s.EmployeeSalaryAmount * 12
          //     }))
          //   }
          //   else e.map((s => {
          //     s.yearlyAmount = ''
          //   }))
          //   return e
          // });

          
          this.spinner.stop('salary');
        } else {
          this.spinner.stop('salary');
        }
      });
  }

  showSalary(salary: any = []) {
    this.salaryData = salary
  }


}
