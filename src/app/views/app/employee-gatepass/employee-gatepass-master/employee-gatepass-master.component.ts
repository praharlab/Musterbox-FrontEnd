import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-employee-gatepass-master',
    templateUrl: './employee-gatepass-master.component.html',
    styleUrls: ['./employee-gatepass-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeGatepassMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  EmployeeGatePassArray: any = [];
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          this.visible = true;
          this.spinner.stop('oninit');
        }
      });

    this.EmployeeGatePassArray = [
      {
        icon: 'iconsminds-newspaper',
        label: 'Employee Gate Pass',
        menu: 'AllEmployeeGatepass',
        to: `${this.adminRoot}/employeegatepasses/list_empgatepass`,
      },

      // {
      //   icon: 'iconsminds-newspaper',
      //   label: 'Gate Pass Request',
      //   menu: 'EmployeeGatepassRequest',
      //   to: `${this.adminRoot}/employeegatepasses/gatepassRequest`,
      // },
      {
        icon: 'iconsminds-newspaper',
        label: 'My Employee Gate Pass',
        menu: 'MyEmployeeGatepass',
        to: `${this.adminRoot}/employeegatepasses/list_mygatepass`,
      },
      {
        icon: 'iconsminds-newspaper',
        label: 'Employee Gate Pass Authorization',
        menu: 'EmployeeGatepassRequest',
        to: `${this.adminRoot}/employeegatepasses/gatepass-authorization`,
      },
    ];


  }
}
