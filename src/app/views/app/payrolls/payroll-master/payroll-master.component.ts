import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-payroll-master',
    templateUrl: './payroll-master.component.html',
    styleUrls: ['./payroll-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PayrollMasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  PayrollArray: any = [];
  EmpPayrollArray: any = [];

  MyPayrollArray: any = [];
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

    this.MyPayrollArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'My Salary Slip',
        menu: 'SalarySlip',
        to: `${this.adminRoot}/payrolls/salaryslip`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My Pay',
        menu: 'MyPay',
        to: `${this.adminRoot}/payrolls/my_salary`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Outside Attendance',
        menu: 'OutsideAttendancePermission',
        to: `${this.adminRoot}/payrolls/datewiseAttendancePolicy`,
      },
      {
        icon: 'iconsminds-bell',
        label: 'Announcement',
        menu: 'Announcement',
        to: `${this.adminRoot}/payrolls/announcement`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'My Pay Slip',
        menu: 'MypaySlipPIH',
        to: `${this.adminRoot}/payrolls/my-pay-slip`,
      },
    ];

    this.EmpPayrollArray = [
      {
        icon: 'iconsminds-optimization',
        label: 'Hr Dashboard',
        menu: 'HrDashboard',
        to: `${this.adminRoot}/payrolls/hr-dashboard`,
      },
      {
        label: 'Employee Master',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/employee`,
        menu: 'EmployeeMaster',
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Employeee Joining Request Form',
        menu: 'EmployeeJoiningRequestForm',
        to: `${this.adminRoot}/payrolls/listJoiningRequestform`,
      },
      {
        icon: 'iconsminds-male-2',
        label: 'Employeee Joining Request',
        menu: 'EmployeeJoiningRequest',
        to: `${this.adminRoot}/payrolls/listJoiningRequest`,
      },

      // {
      //   icon: 'iconsminds-male-2',
      //   label: 'Employee List',
      //   menu: 'EmployeeMaster',
      //   to: `${this.adminRoot}/payrolls/employee_list`,
      // },
      {
        icon: 'iconsminds-male-2',
        label: 'Employee Policy',
        menu: 'EmployeePolicy',
        to: `${this.adminRoot}/payrolls/employee-policy`,
      },
      {
        icon: 'iconsminds-male-2',
        label: 'Employee Salary Structure',
        menu: 'EmployeeSalaryStructure',
        to: `${this.adminRoot}/payrolls/employee-salary-structure`,
      },

      {
        icon: 'iconsminds-money-bag',
        label: 'Employee Nda',
        menu: 'Nda',
        to: `${this.adminRoot}/payrolls/employee_nda`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'HR Toolkit',
        menu: 'HrToolkit',
        to: `${this.adminRoot}/payrolls/toolkit`,
      },
      {
        icon: 'iconsminds-credit-card',
        label: 'ID CARD',
        menu: 'IDCard',
        to: `${this.adminRoot}/payrolls/id_card`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Employee Accident Form',
        menu: 'EmployeeAccident',
        to: `${this.adminRoot}/payrolls/list_employee_accident`,
      },
      {
        icon: 'iconsminds-profile',
        label: 'Customize Profile',
        menu: 'CustomizeProfile',
        to: `${this.adminRoot}/payrolls/customizeProfile`,
      },
    ];

    this.PayrollArray = [
      {
        icon: 'iconsminds-notepad',
        label: 'Attendance & Salary Calculation',
        menu: 'AttendanceCalculation',
        to: `${this.adminRoot}/payrolls/attendancecal`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Monthly Attendance Entry',
        menu: 'MonthlyAttendanceEntry',
        to: `${this.adminRoot}/payrolls/monthlyAttendanceEntry`,
      },

      {
        icon: 'iconsminds-id-card',
        label: 'Full and Final Settlement',
        menu: 'FullandFinalSettlement',
        to: `${this.adminRoot}/payrolls/fnf`,
      },

      {
        icon: 'iconsminds-notepad',
        label: 'E-Mail Salary Slip',
        menu: 'EmailSalarySlip',
        to: `${this.adminRoot}/payrolls/e_mail_salary_slip`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Download Salary Slip In Bulk',
        menu: 'DownloadSalarySlipInBulk',
        to: `${this.adminRoot}/payrolls/bulk_salarySlip_download`,
      },

      // {
      //   icon: 'iconsminds-notepad',
      //   label: 'Attendance Penalty',
      //   menu: 'PenaltyManagement',
      //   to: `${this.adminRoot}/payrolls/manage_panelty`,
      // },
      {
        icon: 'iconsminds-notepad',
        label: 'Compensatory Off',
        menu: 'CompensatoryOff',
        to: `${this.adminRoot}/payrolls/manage_coff`,
      },


      {
        icon: 'iconsminds-notepad',
        label: 'Employee Incentive',
        menu: 'EmployeeIncentive',
        to: `${this.adminRoot}/payrolls/list-employeeincentive`,
      },

      {
        icon: 'iconsminds-money-bag',
        label: 'Add Leave Balance',
        menu: 'AddMonthlyLeaveBalance',
        to: `${this.adminRoot}/payrolls/add_leave_balance`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'Previous Salary',
        menu: 'PreviousSalary',
        to: `${this.adminRoot}/payrolls/previous_salary`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'WeekOff Shuffle',
        menu: 'WeekOffShuffle',
        to: `${this.adminRoot}/payrolls/weekoff_shuffle`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Extra Days',
        menu: 'ExtraDays',
        to: `${this.adminRoot}/payrolls/extradays`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Manage Leave Balance',
        menu: 'ManageLeaveBalance',
        to: `${this.adminRoot}/payrolls/manage-leave-balance`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Leave Encashment',
        menu: 'leaveEncashment',
        to: `${this.adminRoot}/payrolls/leaveEncashment`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Employee Bonus',
        menu: 'EmployeeBonus',
        to: `${this.adminRoot}/payrolls/employee_bonus`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Employee Bonus Payment',
        menu: 'EmployeeBonusPayment',
        to: `${this.adminRoot}/payrolls/empBonusPayment`,
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Pay Slip Generator',
        menu: 'PaySlipGenerator',
        to: `${this.adminRoot}/payrolls/paySlipGenerator`,
      },
       {
        icon: 'iconsminds-notepad',
        label: 'Minimum Wages Master',
        menu: 'MinimumWagesMaster',
        to: `${this.adminRoot}/payrolls/minimumWagesMaster`,
      },
    ];
  }
}
