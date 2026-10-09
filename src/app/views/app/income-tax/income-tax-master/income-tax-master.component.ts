import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-income-tax-master',
    templateUrl: './income-tax-master.component.html',
    styleUrls: ['./income-tax-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IncomeTaxMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  adminRoot = environment.adminRoot;

  UtilityArray: any = [];

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

    this.UtilityArray = [

      // {
      //   icon: 'iconsminds-notepad',
      //   label: 'Employee Invesments',
      //   menu: 'MoodTracker',
      //   to: `${this.adminRoot}/incometax/list_emp_investment`,
      // },

      {
        icon: 'iconsminds-notepad',
        label: 'My Income Tax Regime',
        menu: 'MyIncomeTaxRegime',
        to: `${this.adminRoot}/incometax/list_my_incometax_regime`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Employee Tax Regime',
        menu: 'EmployeeIncomeTaxRegime',
        to: `${this.adminRoot}/incometax/list_employee_tax_regime`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My IncomeTax Declaration',
        menu: 'MyIncometaxDeclaration',
        to: `${this.adminRoot}/incometax/incometax_declaration`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'IncomeTax Declaration Request',
        menu: 'IncometaxDeclarationRequest',
        to: `${this.adminRoot}/incometax/incometax_declaration_request`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Monthly Tax deductions Of Employees',
        menu: 'MonthlyTaxDeductionsOfEmployees',
        to: `${this.adminRoot}/incometax/monthlyTax_Deductions_Of_employees`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Form 16',
        menu: 'Form16',
        to: `${this.adminRoot}/incometax/form16`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Employee IncomeTax Declaration',
        menu: 'EmployeeIncomeTaxDeclaration',
        to: `${this.adminRoot}/incometax/employeeIncomeTaxDeclaration`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Employee Declaration Report',
        menu: 'EmployeeDeclarationReport',
        to: `${this.adminRoot}/incometax/employee-declaration-report`,
      },

    ];

  }
}
