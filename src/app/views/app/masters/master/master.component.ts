import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-master',
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  OrgArray: any = [];
  PayrollArray: any = [];
  MyFinancesArray: any = [];
  VisitMainArray: any = [];
  AssetMasterArray: any = [];
  GatePassArray: any = [];
  TaskStagesArray: any = [];
  jobArray: any = [];

  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

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

    this.OrgArray = [
      {
        label: 'Company',
        to: `${this.adminRoot}/masters/company_master`,
        icon: 'iconsminds-embassy',
        menu: 'Company',
      },
      {
        label: 'Branch',
        to: `${this.adminRoot}/masters/branch`,
        icon: 'iconsminds-chrysler-building',
        menu: 'Branch',
      },
      {
        label: 'Department',
        to: `${this.adminRoot}/masters/department`,
        icon: 'iconsminds-management',
        menu: 'Department',
      },
      {
        label: 'Designation',
        to: `${this.adminRoot}/masters/designation`,
        icon: 'iconsminds-engineering',
        menu: 'Designation',
      },
      {
        label: 'Division',
        to: `${this.adminRoot}/masters/division`,
        icon: 'iconsminds-engineering',
        menu: 'Division',
      },

      {
        label: 'Working Area',
        to: `${this.adminRoot}/masters/working_area`,
        icon: 'iconsminds-engineering',
        menu: 'WorkingArea',
      },
      {
        label: 'Working Location',
        to: `${this.adminRoot}/masters/workingLocation`,
        icon: 'iconsminds-shop-4',
        menu: 'WorkingLocation',
      },
      {
        label: 'Hr Leave Types',
        to: `${this.adminRoot}/masters/leavetypes`,
        icon: 'iconsminds-shop-4',
        menu: 'Leave Types',
      },
      {
        label: 'Joining Document Type',
        to: `${this.adminRoot}/masters/joiningDocumentType`,
        icon: 'iconsminds-shop-4',
        menu: 'JoiningDocumentType',
      },
      {
        label: 'Designation Wise Document',
        to: `${this.adminRoot}/masters/designationWiseDocument`,
        icon: 'iconsminds-shop-4',
        menu: 'DesignationWiseDocument',
      },
      {
        label: 'Project',
        to: `${this.adminRoot}/masters/project`,
        icon: 'iconsminds-shop-4',
        menu: 'ProjectMaster',
      },
      {
        label: 'Attendance Correction Reason',
        to: `${this.adminRoot}/masters/attendaceCorrectionReason`,
        icon: 'iconsminds-shop-4',
        menu: 'AttendanceCorrectionReason',
      },
      {
        label: 'Bank Statement Format',
        to: `${this.adminRoot}/masters/bankStatementFormat`,
        icon: 'iconsminds-shop-4',
        menu: 'BankStatementFormat',
      },
      {
        label: 'Site',
        to: `${this.adminRoot}/masters/site`,
        icon: 'iconsminds-chrysler-building',
        menu: 'siteMaster',
      },
    ];

    this.PayrollArray = [
      {
        label: 'Employee Master',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/employee`,
        menu: 'EmployeeMaster',
      },

      {
        label: 'Profile Photo Lock Unlock',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/Profile_photo_lockunlock`,
        menu: 'EmployeeMaster',
      },
      {
        label: ' IP Whitelisting ',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/userIp`,
        menu: 'IPWhitelisting',
      },
      {
        icon: 'simple-icon-grid',
        label: 'Employee Leave Policy',
        menu: 'EmployeeLeavePolicy',
        to: `${this.adminRoot}/masters/employee_leave_policy`,
      },
      {
        label: 'Attendance Policy',
        icon: 'iconsminds-notepad',
        to: `${this.adminRoot}/masters/attendance_policy`,
        menu: 'AttendancePolicy',
      },
      {
        label: 'LateCome EarlyGo Policy',
        icon: 'iconsminds-notepad',
        to: `${this.adminRoot}/masters/lateComeEarlyGo`,
        menu: 'LateInEarlygoPolicy',
      },
      {
        label: 'Salary Policy',
        icon: 'iconsminds-notepad',
        to: `${this.adminRoot}/masters/salary_policy`,
        menu: 'SalaryPolicy',
      },
      {
        label: 'Salary Grade',
        icon: 'iconsminds-network',
        to: `${this.adminRoot}/masters/grade`,
        menu: 'Grade',
      },
      {
        label: 'Shift',
        icon: 'iconsminds-fog-day',
        to: `${this.adminRoot}/masters/shift`,
        menu: 'Shift',
      },
      {
        label: 'Food Allowance Policy',
        to: `${this.adminRoot}/masters/foodAllowancePolicy`,
        icon: 'iconsminds-shop-4',
        menu: 'FoodAllowancePolicy',
      },
      {
        label: 'Attendance Bonus Policy',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/attendance_bonus_policy`,
        menu: 'AttendanceBonusPolicy',
      },
      {
        label: 'Weekoff Policy',
        icon: 'iconsminds-newspaper',
        to: `${this.adminRoot}/masters/weekoffpolicy`,
        menu: 'Weekoff',
      },
      {
        label: 'Short Leave Policy',
        icon: 'iconsminds-newspaper',
        to: `${this.adminRoot}/masters/short_leave_policy`,
        menu: 'ShortLeavePolicy',
      },
      {
        label: 'Holiday Policy',
        icon: 'iconsminds-newspaper',
        to: `${this.adminRoot}/masters/holidayPolicy`,
        menu: 'Holiday',
      },

      {
        label: 'Bonus Policy',
        icon: 'iconsminds-newspaper',
        to: `${this.adminRoot}/masters/bonus_policy`,
        menu: 'BonusPolicy',
      },

      {
        label: 'HR Salary Fields',
        icon: 'iconsminds-shop-4',
        to: `${this.adminRoot}/masters/hr_field_salary`,
        menu: 'SalaryFields',
      },
      {
        label: 'Tracking Employee',
        icon: 'iconsminds-location-2',
        to: `${this.adminRoot}/masters/employee_tracking`,
        menu: 'TrackingEmployee',
      },
      {
        label: 'Nda Category',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/nda_category`,
        menu: 'NdaCategory',
      },
      {
        label: 'Bulk Shift',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk_add_shift`,
        menu: 'BulkShift',
      },
      {
        label: 'Bulk Weekoff',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk_add_weekoff`,
        menu: 'BulkWeekoff',
      },
      {
        label: 'Bulk Holiday',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk_add_holiday`,
        menu: 'BulkHoliday',
      },
      {
        label: 'Bulk Attendance Policy',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk__attendance__policy`,
        menu: 'BulkAttendancePolicy',
      },
      {
        label: 'Bulk LateIn EarlyGo Policy',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk__lateinearlygo__policy`,
        menu: 'BulkLateInEarlygoPolicy',
      },
      {
        label: 'Bulk Salary Policy',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk__salary__policy`,
        menu: 'BulkSalaryPolicy',
      },
      {
        label: 'Bulk Working Location',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk_addworkingLocation`,
        menu: 'BulkWorkingLocation',
      },
      {
        label: 'Bulk Employee Division',
        to: `${this.adminRoot}/masters/bulk_addEmployeeDivision`,
        icon: 'iconsminds-engineering',
        menu: 'AddBulkEmployeeDivision',
      },
      {
        label: 'Bulk Employee Working Area',
        to: `${this.adminRoot}/masters/bulk_addEmployeeWorkingArea`,
        icon: 'iconsminds-engineering',
        menu: 'AddBulkEmployeeWorkingArea',
      },
      {
        label: 'Bulk Attendance Bonus Policy',
        to: `${this.adminRoot}/masters/bulk_attendanceBonus_policy`,
        icon: 'iconsminds-engineering',
        menu: 'BulkAttendanceBonusPolicy',
      },
      {
        label: 'Bulk Employee Food Allowance Policy',
        to: `${this.adminRoot}/masters/bulk_addEmployee_foodAllowancePolicy`,
        icon: 'iconsminds-engineering',
        menu: 'BulkFoodAllowancePolicy',
      },
      {
        label: 'Bulk Employee Leave Policy',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk_addEmpLeavePolicy`,
        menu: 'BulkLeavePolicy',
      },
      {
        label: 'Bulk Short Leave Policy',
        icon: 'iconsminds-newspaper',
        to: `${this.adminRoot}/masters/bulk-short-leave-policy`,
        menu: 'BulkShortLeavePolicy',
      },
      {
        label: 'Bulk Employee Skill Category',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk_employee_skill_category`,
        menu: 'BulkEmployeeSkillCategory',
      },

      {
        label: 'Bulk Employee Bonus Policy',
        icon: 'iconsminds-newspaper',
        to: `${this.adminRoot}/masters/bulk_employee_bonus_policy`,
        menu: 'BulkAddEmployeeBonusPolicy',
      },

      {
        label: 'Bulk Assign Project',
        icon: 'iconsminds-money-bag',
        to: `${this.adminRoot}/masters/bulk_addProject`,
        menu: 'BulkAssignProject',
      },
      {
        label: 'HR ToolKit',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/toolkit`,
        menu: 'HrToolkit',
      },
      {
        label: 'Clearance And Exit Process',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/clearance-and-exit`,
        menu: 'ResignationProcess',
      },
      {
        label: 'Incentive Type',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/list-incentivetype`,
        menu: 'Incentive',
      },
      {
        label: 'Contractor',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/cotractor`,
        menu: 'Contractor',
      },

      {
        label: 'Contractor Service Charge',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/service_charge`,
        menu: 'ContractorServiceCharge',
      },
    ];

    this.MyFinancesArray = [
      {
        menu: 'ExpenseCategory',
        icon: 'iconsminds-increase-inedit',
        to: `${this.adminRoot}/masters/expense_category`,
        label: 'Expense Category',
      },
      {
        menu: 'ExpenseHead',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/expense_head`,
        label: 'Expense Head',
      },
      {
        menu: 'OfficeExpenseCategory',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/officeExpenseCategory`,
        label: 'Office Expense Category',
      },
      {
        menu: 'OfficeExpenseHead',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/officeExpenseHead`,
        label: 'Office Expense Head',
      },
      {
        menu: 'DepositCategory',
        icon: 'iconsminds-male-2',
        to: `${this.adminRoot}/masters/depositCategory`,
        label: 'Deposit Category',
      },
      {
        menu: 'Penalty',
        icon: 'iconsminds-euro',
        to: `${this.adminRoot}/masters/penalty`,
        label: 'Penalty',
      },
    ];

    this.VisitMainArray = [
      {
        menu: 'VisitCustomizeField',
        to: `${this.adminRoot}/masters/visit_field_customize`,
        icon: 'iconsminds-decrase-inedit',
        label: 'Visit Customize Field',
      },

      {
        menu: 'VisitCustomizeField',
        to: `${this.adminRoot}/masters/visit_purpose`,
        icon: 'iconsminds-decrase-inedit',
        label: 'Visit Purpose Master',
      },
      {
        menu: 'VisitReportMaster',
        to: `${this.adminRoot}/masters/visit_report_master`,
        icon: 'iconsminds-fax',
        label: 'Visit Report Master',
      },
      {
        menu: 'VisitReportCustomizeField',
        to: `${this.adminRoot}/masters/visit_report_customize`,
        icon: 'iconsminds-male',
        label: 'Visit Report Customize',
      },
      {
        menu: 'Product',
        to: `${this.adminRoot}/masters/product`,
        icon: 'iconsminds-basket-coins',
        label: 'Product',
      },
      {
        menu: 'Customer',
        to: `${this.adminRoot}/masters/customer`,
        icon: 'iconsminds-business-man',
        label: 'Customer',
      },
    ];

    this.AssetMasterArray = [
      {
        menu: 'AssetCategory',
        icon: 'iconsminds-headphones',
        to: `${this.adminRoot}/masters/asset_category`,
        label: ' Asset Category',
      },
      {
        menu: 'AssetMaster',
        icon: 'iconsminds-headphones',
        to: `${this.adminRoot}/masters/assetMaster`,
        label: 'Asset Master',
      },
    ];

    this.GatePassArray = [
      {
        menu: 'MeetingLocation',
        icon: 'iconsminds-building',
        to: `${this.adminRoot}/masters/meetingPlace`,
        label: 'Meeting Location',
      },
      {
        menu: 'Visitors',
        icon: 'iconsminds-business-man',
        to: `${this.adminRoot}/masters/visitor`,
        label: 'Visitors',
      },
    ];

    this.TaskStagesArray = [
      {
        menu: 'TaskStages',
        icon: 'iconsminds-books',
        to: `${this.adminRoot}/tasks/task_stages`,
        label: 'Task Stages',
      },
    ];

    this.jobArray = [
      {
        label: 'Job Role Type',
        to: `${this.adminRoot}/masters/jobRoleClassification`,
        icon: 'iconsminds-shop-4',
        menu: 'JobRoleType',
      },
    ];
  }
}
