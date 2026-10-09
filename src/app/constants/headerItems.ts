import { UserRole } from '../shared/auth.roles';
import { environment } from '../../../src/environments/environment';

const adminRoot = environment.adminRoot;

export interface IHeaderItem {
  id?: string;
  icon?: string;
  label: string;
  menu: string;
  to: string;
  newWindow?: boolean;
  subs?: IHeaderItem[];
  roles?: UserRole[];
}

const getHeaderItems = () => {
  let data1: any;
  let data2: any = localStorage.getItem('usertype');

  if (data2 == 2) {
    const data: IHeaderItem[] = [
      {
        icon: 'iconsminds-shop-4',
        label: 'menu.dashboards',
        menu: 'VisitPurpose',
        to: `${adminRoot}/dashboards/default`,
      },
      {
        icon: 'iconsminds-embassy',
        label: 'Admin Menu',
        menu: 'Company',
        to: `${adminRoot}/superadminmenus`,
        // roles: [UserRole.Admin],
        subs: [
          {
            icon: 'iconsminds-embassy',
            label: 'Admin Menu',
            menu: 'Company',
            to: `${adminRoot}/superadminmenus/superAdminMenu`,
          },
          {
            icon: 'iconsminds-embassy',
            label: 'Company',
            menu: 'Company',
            to: `${adminRoot}/superadminmenus/company_master`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-check',
            label: 'Company Type',
            menu: 'CompanyType',
            to: `${adminRoot}/superadminmenus/company_type`,
            // roles: [UserRole.Admin],
          },

          {
            icon: 'iconsminds-check',
            label: 'Mail Template Type',
            menu: 'MailTemplateType',
            to: `${adminRoot}/superadminmenus/mailTemplate_type`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-check',
            label: 'Mail Fields',
            menu: 'MailFields',
            to: `${adminRoot}/superadminmenus/mail_fields`,
            // roles: [UserRole.Admin],
          },

          {
            icon: 'iconsminds-check',
            label: 'Letter Tamplate Type',
            menu: 'LetterTamplateType',
            to: `${adminRoot}/superadminmenus/letter_type`,
            // roles: [UserRole.Admin],
          },

          {
            icon: 'iconsminds-check',
            label: 'Letter Fields',
            menu: 'LetterFields',
            to: `${adminRoot}/superadminmenus/letter_fields`,
            // roles: [UserRole.Admin],
          },

          {
            icon: 'iconsminds-bag-items',
            label: 'Subscription Plan',
            menu: 'ProductMaster',
            to: `${adminRoot}/superadminmenus/product_master`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'Bank',
            menu: 'Bank',
            to: `${adminRoot}/superadminmenus/bank`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-equalizer',
            label: 'PT Master',
            menu: 'PTSetup',
            to: `${adminRoot}/superadminmenus/ptmaster`,
          },
          {
            icon: 'iconsminds-file',
            label: 'Document List',
            menu: 'DocumentList',
            to: `${adminRoot}/superadminmenus/document_list`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-files',
            label: 'Company Doc List',
            menu: 'CompanyDocList',
            to: `${adminRoot}/superadminmenus/company_document`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-add',
            label: 'Operation',
            menu: 'Operation',
            to: `${adminRoot}/superadminmenus/operation`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-add-file',
            label: 'Form',
            menu: 'Form',
            to: `${adminRoot}/superadminmenus/form`,
            // roles: [UserRole.Admin],
          },
          {
            icon: 'iconsminds-shop-4',
            label: 'Payhead Master',
            to: `${adminRoot}/superadminmenus/payheadmaster`,
            menu: 'PayheadMaster',
          },
          {
            icon: 'iconsminds-shop-4',
            label: 'Leave Master',
            to: `${adminRoot}/superadminmenus/leaveMaster`,
            menu: 'LeaveMaster',
          },
          {
            icon: 'iconsminds-smartphone-3',
            label: 'App Version',
            to: `${adminRoot}/superadminmenus/appversion`,
            menu: 'AppVersion',
          },
          {
            icon: 'iconsminds-user',
            label: 'Super Admin',
            to: `${adminRoot}/superadminmenus/superadmin`,
            menu: 'SuperAdmin',
          },
          {
            icon: 'iconsminds-user',
            label: 'Sub Admin',
            to: `${adminRoot}/superadminmenus/subadmin`,
            menu: 'SubAdmin',
          },
          {
            icon: 'iconsminds-user',
            label: 'Auth Master',
            to: `${adminRoot}/superadminmenus/auth_master`,
            menu: 'auth_master',
          },
          {
            icon: 'iconsminds-user',
            label: 'Report',
            to: `${adminRoot}/superadminmenus/company_report`,
            menu: 'auth_master',
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Form 16',
            menu: 'form16',
            to: `${adminRoot}/superadminmenus/form16`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Biometric',
            menu: 'biometric',
            to: `${adminRoot}/superadminmenus/biometric_integration`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Module List',
            menu: 'form16',
            to: `${adminRoot}/superadminmenus/Module_list`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Module Details',
            menu: 'form16',
            to: `${adminRoot}/superadminmenus/Module_details`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'HR Toolkit',
            menu: 'form16',
            to: `${adminRoot}/superadminmenus/hr_toolkit`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'TDS Section',
            menu: 'form16',
            to: `${adminRoot}/superadminmenus/list_tds_section`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'TDS Sub Section',
            menu: 'form16',
            to: `${adminRoot}/superadminmenus/list_tds_sub_section`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'TDS Sub Section Category',
            menu: 'MoodTracker',
            to: `${adminRoot}/superadminmenus/tds_subsection_category`,
          },
        ],
      },
    ];
    data1 = data;
  } else if (data2 == 3) {
    const data: IHeaderItem[] = [
      {
        icon: 'iconsminds-shop-4',
        label: 'menu.dashboards',
        menu: 'VisitPurpose',
        to: `${adminRoot}/dashboards/default`,
      },
      {
        icon: 'iconsminds-embassy',
        label: 'Company',
        menu: 'Company',
        to: `${adminRoot}/masters/company_master`,
        // roles: [UserRole.Admin],
      },
    ];
    data1 = data;
  } else {
    const data: IHeaderItem[] = [
      {
        icon: 'iconsminds-home',
        label: 'Home',
        menu: 'Home',
        to: `${adminRoot}/dashboards/analytics`,
      },
      {
        icon: 'iconsminds-male',
        label: 'Me',
        menu: 'Me',
        to: `${adminRoot}/me`,
      },
      {
        icon: 'iconsminds-id-card',
        label: 'Utility',
        menu: 'Utility',
        to: `${adminRoot}/utilitys`,

        subs: [
          {
            icon: 'iconsminds-id-card',
            label: 'Utility',
            menu: 'Utility',
            to: `${adminRoot}/utilitys/utility_master`,
          },
          {
            icon: 'iconsminds-bell',
            label: 'Mail Setup',
            menu: 'MailSetup',
            to: `${adminRoot}/utilitys/notification_policy`,
          },
          {
            icon: 'iconsminds-bell',
            label: 'Notification Setup',
            menu: 'NotificationSetup',
            to: `${adminRoot}/utilitys/notification_setup`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Letter Template',
            menu: 'LetterTemplate',
            to: `${adminRoot}/utilitys/List-Letter-Template`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Mail Template',
            menu: 'MailTemplate',
            to: `${adminRoot}/utilitys/Mail-Template-List`,
          },
        ],
      },
      {
        icon: 'iconsminds-books',
        label: 'Task',
        menu: 'Task',
        to: `${adminRoot}/tasks`,

        subs: [
          {
            icon: 'iconsminds-books',
            label: 'Task Master',
            menu: 'ViewDailyReporting',
            to: `${adminRoot}/tasks/task_master`,
          },
          {
            icon: 'iconsminds-books',
            label: 'Daily Reporting',
            menu: 'ViewDailyReporting',
            to: `${adminRoot}/tasks/dailyTask`,
          },
          {
            icon: 'iconsminds-books',
            label: 'My Daily Reporting',
            menu: 'DailyUserReporting',
            to: `${adminRoot}/tasks/user_dailyTask`,
          },

          {
            icon: 'iconsminds-books',
            label: 'Assign Task',
            menu: 'AssignTask',
            to: `${adminRoot}/tasks/task`,
          },
          {
            icon: 'iconsminds-books',
            label: 'My Task',
            menu: 'MyTask',
            to: `${adminRoot}/tasks/myTask`,
          },
        ],
      },

      {
        icon: 'iconsminds-notepad',
        label: 'Master',
        menu: 'Master',
        to: `${adminRoot}/masters`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'Master',
            menu: 'Master',
            to: `${adminRoot}/masters/master`,
          },
          {
            label: 'Company',
            to: `${adminRoot}/masters/company_master`,
            icon: 'iconsminds-embassy',
            menu: 'Company',
          },
          {
            label: 'Branch',
            to: `${adminRoot}/masters/branch`,
            icon: 'iconsminds-chrysler-building',
            menu: 'Branch',
          },
          {
            label: 'Department',
            to: `${adminRoot}/masters/department`,
            icon: 'iconsminds-management',
            menu: 'Department',
          },
          {
            label: 'Designation',
            to: `${adminRoot}/masters/designation`,
            icon: 'iconsminds-engineering',
            menu: 'Designation',
          },
          {
            label: 'Division',
            to: `${adminRoot}/masters/division`,
            icon: 'iconsminds-engineering',
            menu: 'Division',
          },
          {
            label: 'Bulk Employee Division',
            to: `${adminRoot}/masters/bulk_addEmployeeDivision`,
            icon: 'iconsminds-engineering',
            menu: 'AddBulkEmployeeDivision',
          },

          {
            label: 'Working Area',
            to: `${adminRoot}/masters/working_area`,
            icon: 'iconsminds-engineering',
            menu: 'WorkingArea',
          },
          {
            label: 'Site',
            to: `${adminRoot}/masters/site`,
            icon: 'iconsminds-chrysler-building',
            menu: 'siteMaster',
          },
          {
            label: 'Bulk Employee Working Area',
            to: `${adminRoot}/masters/bulk_addEmployeeWorkingArea`,
            icon: 'iconsminds-engineering',
            menu: 'AddBulkEmployeeWorkingArea',
          },
          {
            label: 'Hr Leave Types',
            to: `${adminRoot}/masters/leavetypes`,
            icon: 'iconsminds-shop-4',
            menu: 'Leave Types',
          },
          {
            label: 'Employee Master',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/employee`,
            menu: 'EmployeeMaster',
          },
          {
            label: 'Profile Photo Lock Unlock',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/Profile_photo_lockunlock`,
            menu: 'EmployeeMaster',
          },
          {
            label: 'Attendance Policy',
            icon: 'iconsminds-notepad',
            to: `${adminRoot}/masters/attendance_policy`,
            menu: 'AttendancePolicy',
          },

          {
            label: 'Bonus Policy',
            icon: 'iconsminds-newspaper',
            to: `${adminRoot}/masters/bonus_policy`,
            menu: 'BonusPolicy',
          },

          {
            label: 'Bulk Employee Bonus Policy',
            icon: 'iconsminds-newspaper',
            to: `${adminRoot}/masters/bulk_employee_bonus_policy`,
            menu: 'BulkAddEmployeeBonusPolicy',
          },

          {
            label: 'Food Allowance Policy',
            to: `${adminRoot}/masters/foodAllowancePolicy`,
            icon: 'iconsminds-shop-4',
            menu: 'FoodAllowancePolicy',
          },
          {
            icon: 'simple-icon-grid',
            label: 'Employee Leave Policy',
            menu: 'EmployeeLeavePolicy',
            to: `${adminRoot}/masters/employee_leave_policy`,
          },
          {
            label: 'Bulk Food Allowance Policy',
            to: `${adminRoot}/masters/bulk_addEmployee_foodAllowancePolicy`,
            icon: 'iconsminds-engineering',
            menu: 'BulkFoodAllowancePolicy',
          },

          {
            label: 'Salary Policy',
            icon: 'iconsminds-notepad',
            to: `${adminRoot}/masters/salary_policy`,
            menu: 'SalaryPolicy',
          },
          {
            label: 'Salary Grade',
            icon: 'iconsminds-network',
            to: `${adminRoot}/masters/grade`,
            menu: 'Grade',
          },
          {
            label: 'Shift',
            icon: 'iconsminds-fog-day',
            to: `${adminRoot}/masters/shift`,
            menu: 'Shift',
          },
          {
            label: 'Weekoff Policy',
            icon: 'iconsminds-newspaper',
            to: `${adminRoot}/masters/weekoffpolicy`,
            menu: 'Weekoff',
          },
          {
            label: 'Holiday Policy',
            icon: 'iconsminds-newspaper',
            to: `${adminRoot}/masters/holidayPolicy`,
            menu: 'Holiday',
          },
          {
            label: 'HR Salary Fields',
            icon: 'iconsminds-shop-4',
            to: `${adminRoot}/masters/hr_field_salary`,
            menu: 'SalaryFields',
          },
          {
            label: 'Tracking Employee',
            icon: 'iconsminds-location-2',
            to: `${adminRoot}/masters/employee_tracking`,
            menu: 'TrackingEmployee',
          },
          {
            label: 'Nda Category',
            icon: 'iconsminds-money-bag',
            to: `${adminRoot}/masters/nda_category`,
            menu: 'NdaCategory',
          },
          {
            label: 'Bulk Shift',
            icon: 'iconsminds-money-bag',
            to: `${adminRoot}/masters/bulk_add_shift`,
            menu: 'BulkShift',
          },
          {
            label: 'Bulk Weekoff',
            icon: 'iconsminds-money-bag',
            to: `${adminRoot}/masters/bulk_add_weekoff`,
            menu: 'BulkWeekoff',
          },
          {
            label: 'Bulk Holiday',
            icon: 'iconsminds-money-bag',
            to: `${adminRoot}/masters/bulk_add_holiday`,
            menu: 'BulkHoliday',
          },
          {
            label: 'Bulk Attendance Policy',
            icon: 'iconsminds-money-bag',
            to: `${adminRoot}/masters/bulk__attendance__policy`,
            menu: 'BulkAttendancePolicy',
          },
          {
            label: 'Bulk Salary Policy',
            icon: 'iconsminds-money-bag',
            to: `${adminRoot}/masters/bulk__salary__policy`,
            menu: 'BulkSalaryPolicy',
          },
          {
            label: 'HR ToolKit',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/toolkit`,
            menu: 'HrToolkit',
          },
          {
            label: 'Resignation Process',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/resignation_process`,
            menu: 'ResignationProcess',
          },
          {
            label: 'Incentive Type',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/list-incentivetype`,
            menu: 'Incentive',
          },
          {
            menu: 'ExpenseCategory',
            icon: 'iconsminds-increase-inedit',
            to: `${adminRoot}/masters/expense_category`,
            label: 'Expense Category',
          },
          {
            menu: 'ExpenseHead',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/expense_head`,
            label: 'Expense Head',
          },
          {
            menu: 'DepositCategory',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/depositCategory`,
            label: 'Deposit Category',
          },
          {
            menu: 'Penalty',
            icon: 'iconsminds-euro',
            to: `${adminRoot}/masters/penalty`,
            label: 'Penalty',
          },
          {
            menu: 'VisitCustomizeField',
            to: `${adminRoot}/masters/visit_field_customize`,
            icon: 'iconsminds-decrase-inedit',
            label: 'Visit Form Customize',
          },

          {
            menu: 'VisitCustomizeField',
            to: `${adminRoot}/masters/visit_purpose`,
            icon: 'iconsminds-decrase-inedit',
            label: 'Visit Purpose Master',
          },
          {
            menu: 'VisitReportMaster',
            to: `${adminRoot}/masters/visit_report_master`,
            icon: 'iconsminds-fax',
            label: 'Visit Report Master',
          },
          {
            menu: 'VisitReportCustomizeField',
            to: `${adminRoot}/masters/visit_report_customize`,
            icon: 'iconsminds-male',
            label: 'Visit Report Customize',
          },
          {
            menu: 'Product',
            to: `${adminRoot}/masters/product`,
            icon: 'iconsminds-basket-coins',
            label: 'Product',
          },
          {
            menu: 'Customer',
            to: `${adminRoot}/masters/customer`,
            icon: 'iconsminds-business-man',
            label: 'Customer',
          },
          {
            menu: 'AssetCategory',
            icon: 'iconsminds-headphones',
            to: `${adminRoot}/masters/asset_category`,
            label: ' Asset Category',
          },
          {
            menu: 'AssetMaster',
            icon: 'iconsminds-headphones',
            to: `${adminRoot}/masters/assetMaster`,
            label: 'Asset Master',
          },
          {
            menu: 'MeetingLocation',
            icon: 'iconsminds-building',
            to: `${adminRoot}/masters/meetingPlace`,
            label: 'Meeting Location',
          },
          {
            menu: 'Visitors',
            icon: 'iconsminds-business-man',
            to: `${adminRoot}/masters/visitor`,
            label: 'Visitors',
          },
          {
            menu: 'TaskStages',
            icon: 'iconsminds-books',
            to: `${adminRoot}/masters/task_stages`,
            label: 'Task Stages',
          },
          {
            label: 'Bulk Short Leave Policy',
            icon: 'iconsminds-newspaper',
            to: `${adminRoot}/masters/bulk-short-leave-policy`,
            menu: 'BulkShortLeavePolicy',
          },
          {
            label: 'Contractor Service Charge',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/service_charge`,
            menu: 'ContractorServiceCharge',
          },
          {
            label: 'Bulk Employee Skill Category',
            icon: 'iconsminds-male-2',
            to: `${adminRoot}/masters/bulk_employee_skill_category`,
            menu: 'BulkEmployeeSkillCategory',
          },
        ],
      },

      {
        icon: 'iconsminds-building',
        label: 'Visit',
        menu: 'VisitMain',
        to: `${adminRoot}/visits`,
        // roles: [UserRole.Admin],
        subs: [
          {
            icon: 'iconsminds-building',
            label: 'Visit',
            menu: 'VisitMain',
            to: `${adminRoot}/visits/visit_master`,
          },
          {
            icon: 'iconsminds-building',
            label: 'Team Visit',
            menu: 'TeamVisit',
            to: `${adminRoot}/visits/myteamvisit`,
          },
          {
            icon: 'iconsminds-building',
            label: 'Visit',
            menu: 'Visit',
            to: `${adminRoot}/visits/visit`,
          },
          {
            icon: 'iconsminds-idea',
            label: 'Tour',
            menu: 'Tour',
            to: `${adminRoot}/visits/tour`,
          },
          {
            icon: 'iconsminds-idea',
            label: 'Tour Report',
            menu: 'AdminTour',
            to: `${adminRoot}/visits/admin-tour`,
          },
          {
            icon: 'iconsminds-gaugage',
            label: 'Vehicle Meter Details',
            menu: 'VehicleMeterDetails',
            to: `${adminRoot}/visits/vehicle_meter_details`,
          },
          {
            icon: 'iconsminds-business-man',
            label: 'Call FollowUp',
            menu: 'CallFollowUp',
            to: `${adminRoot}/visits/callfollowup`,
          },
        ],
      },
      {
        icon: 'iconsminds-business-mens',
        label: 'My Team',
        menu: 'MyTeam',
        to: `${adminRoot}/myteam`,
        subs: [
          {
            icon: 'iconsminds-business-mens',
            label: 'My Team',
            menu: 'MyTeam',
            to: `${adminRoot}/myteam/myteam_master`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Structure',
            menu: 'Structure',
            to: `${adminRoot}/myteam/structure`,
          },
          {
            icon: 'iconsminds-location-2',
            label: 'Location Tracking',
            menu: 'LocationTracking',
            to: `${adminRoot}/myteam/user_tracking`,
          },
        ],
      },
      {
        icon: 'iconsminds-financial',
        label: 'My Finances',
        menu: 'MyFinances',
        to: `${adminRoot}/finances`,
        subs: [
          {
            icon: 'iconsminds-financial',
            label: 'My Finances',
            menu: 'MyFinances',
            to: `${adminRoot}/finances/myfinances_master`,
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'My Advance Payment',
            menu: 'EmployeeAdvance',
            to: `${adminRoot}/finances/advancePaymentNew`,
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'My Deposit',
            menu: 'EmployeeDeposit',
            to: `${adminRoot}/finances/depositUserwise`,
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'My Expense',
            menu: 'Expense',
            to: `${adminRoot}/finances/expense`,
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'My Loan',
            menu: 'EmployeeLoan',
            to: `${adminRoot}/finances/loanUserwise`,
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'My Penalty',
            menu: 'EmployeePenalty',
            to: `${adminRoot}/finances/penaltyUserwise`,
          },
          {
            icon: 'iconsminds-increase-inedit',
            label: 'Advance Payment',
            menu: 'AdvancePayment',
            to: `${adminRoot}/finances/advancePayment`,
          },
          {
            icon: 'iconsminds-male-2',
            label: 'Deposit',
            menu: 'Deposit',
            to: `${adminRoot}/finances/deposit`,
          },

          {
            icon: 'iconsminds-bank',
            label: 'Loan',
            menu: 'LoanMaster',
            to: `${adminRoot}/finances/loanMaster`,
          },

          {
            icon: 'iconsminds-male',
            label: 'Penalty',
            menu: 'AssignPenaltyEmp',
            to: `${adminRoot}/finances/employeepenalty`,
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'Expense Request',
            menu: 'ExpenseRequest',
            to: `${adminRoot}/finances/expense_request`,
          },

          {
            icon: 'iconsminds-money-bag',
            label: 'Expense Payment',
            menu: 'ExpensePayment',
            to: `${adminRoot}/finances/expense_payment`,
          },

          {
            icon: 'iconsminds-money-bag',
            label: 'List Paid Expense',
            menu: 'ExpensePayment',
            to: `${adminRoot}/finances/list_paid_expense`,
          },
          {
            icon: 'iconsminds-link',
            label: 'Erp Account Link',
            menu: 'ErpAccountLink',
            to: `${adminRoot}/finances/erpAccountMaster`,
          },
          {
            icon: 'iconsminds-sync',
            label: 'Erp Sync',
            menu: 'ErpSync',
            to: `${adminRoot}/finances/erpsync`,
          },
          {
            icon: 'iconsminds-link',
            label: 'SN Codes',
            menu: 'SNCode',
            to: `${adminRoot}/finances/sn_codes`,
          },
        ],
      },
      {
        icon: 'iconsminds-embassy',
        label: 'Org',
        menu: 'Org',
        to: `${adminRoot}/orgs`,
        // roles: [UserRole.Admin],
        subs: [
          {
            icon: 'iconsminds-books',
            label: 'Org Master',
            menu: 'ViewDailyReporting',
            to: `${adminRoot}/orgs/org_master`,
          },
          {
            icon: 'iconsminds-add-user',
            label: 'Set Authorization',
            menu: 'Authorization',
            to: `${adminRoot}/orgs/authorization`,
          },
          {
            icon: 'iconsminds-assistant',
            label: 'Roles',
            menu: 'RoleMaster',
            to: `${adminRoot}/orgs/roles`,
          },
          {
            icon: 'iconsminds-assistant',
            label: 'User Permission',
            menu: 'UserPermission',
            to: `${adminRoot}/orgs/assignrole`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Organization Documents',
            menu: 'OrganizationDocument',
            to: `${adminRoot}/orgs/listPolicyDocuments`,
          },
          {
            icon: 'iconsminds-location-2',
            label: 'Admin Location Tracking',
            menu: 'AdminLocationTracking',
            to: `${adminRoot}/orgs/team_location_tracking`,
          },
          {
            icon: 'iconsminds-password-field',
            label: 'Change Password',
            menu: 'changepassword',
            to: `${adminRoot}/orgs/change_password`,
          },
          {
            icon: 'iconsminds-remove',
            label: 'Replace Authorization',
            menu: 'AuthorizationReplace',
            to: `${adminRoot}/orgs/listAuthDetails`,
          },
        ],
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Attendance',
        menu: 'AttendanceMain',
        to: `${adminRoot}/attendances`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'Attendance',
            menu: 'AttendanceMain',
            to: `${adminRoot}/attendances/attendance_master`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'My Attendance',
            menu: 'Attendance',
            to: `${adminRoot}/attendances/attendance`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'My Attendance Summary',
            menu: 'MyAttendanceSummary',
            to: `${adminRoot}/attendances/myattendance-summary`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'My Leave Application',
            menu: 'LeaveApplication',
            to: `${adminRoot}/attendances/employeeLeave`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'My Leave Balance',
            menu: 'MyLeaveBalance',
            to: `${adminRoot}/attendances/my_leave_balance`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'My OutSide Attendance',
            menu: 'MyOutsideAttendance',
            to: `${adminRoot}/attendances/My-Outside-Attendance`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Team OutSide Attendance',
            menu: 'TeamOutsideAttendancePermission',
            to: `${adminRoot}/attendances/Team-Outside-Attendance`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Leave Authorization',
            menu: 'LeaveAuthRequest',
            to: `${adminRoot}/attendances/leave_auth_request/2`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Daily Attendance',
            menu: 'DailyAttendance',
            to: `${adminRoot}/attendances/employee-attendance-list`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Manual Attendance',
            menu: 'ManualAttendance',
            to: `${adminRoot}/attendances/mannual-attendance`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Biometric Attendance',
            menu: 'BiometricAttendance',
            to: `${adminRoot}/attendances/biometeic_attendance_sync`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Upload Attendance',
            menu: 'ExcelAttendance',
            to: `${adminRoot}/attendances/upload-attendance`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: ' Add Manual Leave',
            menu: 'AddManualLeave',
            to: `${adminRoot}/attendances/addmanual-leave`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Leave Cancellation',
            menu: 'LeaveCancellation',
            to: `${adminRoot}/attendances/leave_cancel`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Admin Outdoor Duty',
            menu: 'AdminOutdoorDuty',
            to: `${adminRoot}/attendances/adminOutdoorDuty`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Shift Validate',
            menu: 'ShiftValidate',
            to: `${adminRoot}/attendances/ValidateShiftAttendance`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Bulk Short Leave Application',
            menu: 'BulkShortLeaveApplication',
            to: `${adminRoot}/attendances/bulk-short-leave-application`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Short Leave Authorization',
            menu: 'ShortLeaveAuthorization',
            to: `${adminRoot}/attendances/short-leave-authorization`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'My Short Leave Application',
            menu: 'MyShortLeaveApplication',
            to: `${adminRoot}/attendances/my-short-leave-application`,
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'Short Leave Cancellation',
            menu: 'ShortLeaveCancellation',
            to: `${adminRoot}/attendances/short_leave_cancellation`,
          },
        ],
      },
      {
        icon: 'iconsminds-computer',
        label: 'Asset',
        menu: 'AssetMaster',
        to: `${adminRoot}/assets`,
        subs: [
          {
            icon: 'iconsminds-computer',
            label: 'Asset',
            menu: 'AssetMaster',
            to: `${adminRoot}/assets/asset_master`,
          },
          {
            icon: 'iconsminds-computer',
            label: 'My Asset',
            menu: 'MyAssets',
            to: `${adminRoot}/assets/myasset`,
          },
          {
            icon: 'iconsminds-computer',
            label: 'Asset Assign  ',
            menu: 'AssetAsignEmp',
            to: `${adminRoot}/assets/assetassigntoemp`,
          },
        ],
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'Payroll',
        menu: 'Payroll',
        to: `${adminRoot}/payrolls`,
        subs: [
          {
            icon: 'iconsminds-money-bag',
            label: 'Payroll',
            menu: 'Payroll',
            to: `${adminRoot}/payrolls/payroll_master`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'My Salary Slip',
            menu: 'SalarySlip',
            to: `${adminRoot}/payrolls/salaryslip`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'My Pay',
            menu: 'MyPay',
            to: `${adminRoot}/payrolls/my_salary`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Outside Attendance',
            menu: 'OutsideAttendancePermission',
            to: `${adminRoot}/payrolls/datewiseAttendancePolicy`,
          },
          {
            icon: 'iconsminds-bell',
            label: 'Announcement',
            menu: 'Announcement',
            to: `${adminRoot}/payrolls/announcement`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Hr Dashboard',
            menu: 'HrDashboard',
            to: `${adminRoot}/payrolls/hr-dashboard`,
          },
          {
            icon: 'iconsminds-male-2',
            label: 'Employee Master',
            menu: 'EmployeeMaster',
            to: `${adminRoot}/payrolls/employee`,
          },
          {
            icon: 'iconsminds-male-2',
            label: 'Employee List',
            menu: 'EmployeeMaster',
            to: `${adminRoot}/payrolls/employee_list`,
          },
          {
            icon: 'iconsminds-male-2',
            label: 'Employee Policy',
            menu: 'EmployeePolicy',
            to: `${adminRoot}/payrolls/employee-policy`,
          },

          {
            icon: 'iconsminds-money-bag',
            label: 'Employee Nda',
            menu: 'Nda',
            to: `${adminRoot}/payrolls/employee_nda`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'HR Toolkit',
            menu: 'HrToolkit',
            to: `${adminRoot}/payrolls/toolkit`,
          },
          {
            icon: 'iconsminds-credit-card',
            label: 'ID CARD',
            menu: 'IDCard',
            to: `${adminRoot}/payrolls/id_card`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Employee Accident Form',
            menu: 'EmployeeAccident',
            to: `${adminRoot}/payrolls/list_employee_accident`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Attendance & Salary Calculation',
            menu: 'AttendanceCalculation',
            to: `${adminRoot}/payrolls/attendancecal`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Monthly Attendance Entry',
            menu: 'MonthlyAttendanceEntry',
            to: `${adminRoot}/payrolls/monthlyAttendanceEntry`,
          },

          {
            icon: 'iconsminds-id-card',
            label: 'Full and Final Settlement',
            menu: 'FullandFinalSettlement',
            to: `${adminRoot}/payrolls/fnf`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Download Salary Slip In Bulk',
            menu: 'DownloadSalarySlipInBulk',
            to: `${adminRoot}/payrolls/bulk_salarySlip_download`,
          },

          // {
          //   icon: 'iconsminds-notepad',
          //   label: 'Attendance Penalty',
          //   menu: 'PenaltyManagement',
          //   to: `${adminRoot}/payrolls/manage_panelty`,
          // },
          {
            icon: 'iconsminds-notepad',
            label: 'Compensatory Off',
            menu: 'CompensatoryOff',
            to: `${adminRoot}/payrolls/manage_coff`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Employee Incentive',
            menu: 'EmployeeIncentive',
            to: `${adminRoot}/payrolls/list-employeeincentive`,
          },

          {
            icon: 'iconsminds-money-bag',
            label: 'Add Leave Balance',
            menu: 'AddMonthlyLeaveBalance',
            to: `${adminRoot}/payrolls/add_leave_balance`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Employee Bonus',
            menu: 'EmployeeBonus',
            to: `${adminRoot}/payrolls/employee_bonus`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Employee Bonus Payment',
            menu: 'EmployeeBonusPayment',
            to: `${adminRoot}/payrolls/empBonusPayment`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Pay Slip Generator',
            menu: 'PaySlipGenerator',
            to: `${adminRoot}/payrolls/paySlipGenerator`,
          },
        ],
      },
      {
        icon: 'iconsminds-over-time-2',
        label: 'Overtime',
        menu: 'Overtime',
        to: `${adminRoot}/overtimes`,
        subs: [
          {
            icon: 'iconsminds-over-time-2',
            label: 'Overtime',
            menu: 'Overtime',
            to: `${adminRoot}/overtimes/overtime_master`,
          },
          {
            icon: 'iconsminds-over-time-2',
            label: 'My Overtime',
            menu: 'MyOvertime',
            to: `${adminRoot}/overtimes/overtime`,
          },
          {
            icon: 'iconsminds-over-time-2',
            label: 'Overtime Request',
            menu: 'OvertimeRequest',
            to: `${adminRoot}/overtimes/overtime_request/2`,
          },
          {
            icon: 'iconsminds-over-time-2',
            label: 'Overtime Calculation',
            menu: 'OvertimeCalculation',
            to: `${adminRoot}/overtimes/overtime_calculation`,
          },
          {
            icon: 'iconsminds-over-time-2',
            label: 'Overtime Report',
            menu: 'OvertimeReport',
            to: `${adminRoot}/overtimes/overtime-report`,
          },
          {
            icon: 'iconsminds-over-time-2',
            label: 'Userwise Overtime',
            menu: 'OvertimeReport',
            to: `${adminRoot}/overtimes/overtime_report_userwise`,
          },
        ],
      },
      {
        icon: 'iconsminds-conference',
        label: 'Pre-Boarding',
        menu: 'PreBoarding',
        to: `${adminRoot}/preboardings`,
        subs: [
          {
            icon: 'iconsminds-conference',
            label: 'Pre-Boarding',
            menu: 'PreBoarding',
            to: `${adminRoot}/preboardings/prebording_master`,
          },
          {
            icon: 'iconsminds-conference',
            label: 'Pre-Boarding Form',
            menu: 'PreBoardingForm',
            to: `${adminRoot}/preboardings/add_preboarding`,
          },
          {
            icon: 'iconsminds-conference',
            label: 'HR Pre-Boarding Request',
            menu: 'HRPre-BoardingRequest',
            to: `${adminRoot}/preboardings/hr_preboarding`,
          },
          {
            icon: 'iconsminds-conference',
            label: 'Pre-Boarding Request',
            menu: 'UserPre-BoardingRequest',
            to: `${adminRoot}/preboardings/user_preboarding`,
          },
          {
            icon: 'iconsminds-conference',
            label: 'Pre-Boarding Customize',
            menu: 'PreBoardingCustomize',
            to: `${adminRoot}/preboardings/preboarding_form`,
          },
        ],
      },

      {
        icon: 'iconsminds-remove-file',
        label: 'Off-Boarding',
        menu: 'Offboarding',
        to: `${adminRoot}/offboardings`,
        subs: [
          {
            icon: 'iconsminds-remove-file',
            label: 'Off-Boarding',
            menu: 'Offboarding',
            to: `${adminRoot}/offboardings/offboarding_master`,
          },
          {
            icon: 'iconsminds-remove-file',
            label: 'Resignation',
            menu: 'Resignation',
            to: `${adminRoot}/offboardings/userresignation`,
          },
          {
            icon: 'iconsminds-remove-file',
            label: 'Resignation Request',
            menu: 'ResignationRequest',
            to: `${adminRoot}/offboardings/resignationlist`,
          },
          {
            icon: 'iconsminds-remove-file',
            label: 'Resignation Task',
            menu: 'ResignationTask',
            to: `${adminRoot}/offboardings/resignationtask`,
          },
        ],
      },

      {
        icon: 'iconsminds-optimization',
        label: 'Report',
        menu: 'Report',
        to: `${adminRoot}/reports`,
        subs: [
          {
            icon: 'iconsminds-optimization',
            label: 'Report',
            menu: 'Report',
            to: `${adminRoot}/reports/report_master`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Advance Report',
            menu: 'AdvanceReport',
            to: `${adminRoot}/reports/advance_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Asset Report',
            menu: 'AssetReport',
            to: `${adminRoot}/reports/asset_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Attendance Register-1',
            menu: 'AttendanceRegister-1',
            to: `${adminRoot}/reports/daily_attendance`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Attendance Register-2',
            menu: 'AttendanceRegister-2',
            to: `${adminRoot}/reports/daily_attendance_new`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Attendance Register-3',
            menu: 'AttendanceRegister-3',
            to: `${adminRoot}/reports/attendance_Register3`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Attendance Register - 4',
            menu: 'AttendanceRegister-4',
            to: `${adminRoot}/reports/attendance_Report4`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'CTC Report',
            menu: 'CTCReport',
            to: `${adminRoot}/reports/salaryregister`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Consolidated Report',
            menu: 'ConsolidatedReport',
            to: `${adminRoot}/reports/consolidated-report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Customer Wise Visit report',
            menu: 'CustomerWiseVisitReport',
            to: `${adminRoot}/reports/visit_report_customer`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Deposit Report',
            menu: 'DepositReport',
            to: `${adminRoot}/reports/deposit_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'ESIC Challan',
            menu: 'ESICChallan',
            to: `${adminRoot}/reports/esic_challan`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'ESIC Report',
            menu: 'ESICReport',
            to: `${adminRoot}/reports/esic_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Expense Report',
            menu: 'ExpenseReport',
            to: `${adminRoot}/reports/expense_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Increment Report',
            menu: 'IncrementReport',
            to: `${adminRoot}/reports/increment-report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Kms Report',
            menu: 'KmsReport',
            to: `${adminRoot}/reports/km_report`,
          },

          {
            icon: 'iconsminds-optimization',
            label: 'Leave Application Report',
            menu: 'LeaveApplicationReport',
            to: `${adminRoot}/reports/leave-report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Leave Balance Report',
            menu: 'LeavebalanceReport',
            to: `${adminRoot}/reports/leave-balance-report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Nda Report',
            menu: 'NdaReport',
            to: `${adminRoot}/reports/nda_report`,
          },

          {
            icon: 'iconsminds-optimization',
            label: 'Penalty Report',
            menu: 'PenaltyReport',
            to: `${adminRoot}/reports/penalty_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'PF Challan',
            menu: 'PFChallan',
            to: `${adminRoot}/reports/pf_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'PF Report',
            menu: 'PFReport',
            to: `${adminRoot}/reports/pfreportdata`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'LWF Challan',
            menu: 'LWFChallan',
            to: `${adminRoot}/reports/lwf_challan`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Punchin Punchout Report',
            menu: 'PunchinPunchoutReport',
            to: `${adminRoot}/reports/punchin_Punchout_Report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Miss Punch Report',
            menu: 'MissPunchReport',
            to: `${adminRoot}/reports/miss_punch_report`,
          },

          {
            icon: 'iconsminds-network',
            label: 'Salary Register',
            menu: 'SalaryRegisterReport',
            to: `${adminRoot}/reports/salary-register`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Visit Report',
            menu: 'VisitReport',
            to: `${adminRoot}/reports/visitReport`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Visit Report Summary',
            menu: 'VisitSummaryReport',
            to: `${adminRoot}/reports/visitReportSummary`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Wages/Salary Register',
            menu: 'WagesSalaryRegister',
            to: `${adminRoot}/reports/wages-salary-register`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Hourly-Salary Register ',
            menu: 'HourlySalaryRegister',
            to: `${adminRoot}/reports/hourly-salary-register`,
          },
          {
            icon: 'iconsminds-location-2',
            label: 'Tracking Report',
            menu: 'TrackingReport',
            to: `${adminRoot}/reports/tracking_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Distinct Locations Tracking Report',
            menu: 'DistinctLoationsTrackingReport',
            to: `${adminRoot}/reports/distinct_Locations_Tracking_Report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: '5 Minute Gap Tracking Report',
            menu: 'FiveMinuteGapTrackingReport',
            to: `${adminRoot}/reports/5_Minute_Gap_Tracking_Report`,
          },
          {
            icon: 'iconsminds-location-2',
            label: 'LateIn EarlyGo Report',
            menu: 'LateInEarlyByReport',
            to: `${adminRoot}/reports/lateCome_earlyGo_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'FY Leave Report',
            menu: 'FYWiseLeaveReport',
            to: `${adminRoot}/reports/leave_update_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Leave Balance Summary Report',
            menu: 'LeaveBalanceSummaryReport',
            to: `${adminRoot}/reports/leave_balance_summary_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Daily Cost Report',
            menu: 'DailyCostReport',
            to: `${adminRoot}/reports/perday_cost_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Bank Statement Report',
            menu: 'BankStatementReport',
            to: `${adminRoot}/reports/bankStatementReport`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Daily Hourly Report',
            menu: 'DailyHourlyReport',
            to: `${adminRoot}/reports/dailyHourlyReport`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Employee ReportsTo Report',
            menu: 'EmployeeReportsToReport',
            to: `${adminRoot}/reports/employee_ReportsTo_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Tally Format Attendance Report',
            menu: 'TallyFormateAttendanceReport',
            to: `${adminRoot}/reports/Tale_Attendance_Report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Salary Register With Date Of Pay',
            menu: 'SalaryRegisterWithDateOfPay',
            to: `${adminRoot}/reports/salary_register_with_DateOfPay`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Daily In Out Report',
            menu: 'DailyInOutReport',
            to: `${adminRoot}/reports/daily_inout_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Monthly Attendance Report',
            menu: 'MonthlyAttendanceReport',
            to: `${adminRoot}/reports/monthly_attendance_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Employee Month Wise Salary Report',
            menu: 'EmployeeWiseSalaryReport',
            to: `${adminRoot}/reports/employee_month_wise_salary_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Shiftwise Attendance Count Report',
            menu: 'ShiftwiseAttendanceCountReport',
            to: `${adminRoot}/reports/shiftwise_attendance_count_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Loan Report',
            menu: 'LoanReport',
            to: `${adminRoot}/reports/loan_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Shift & Department Wise Attendance Count Report',
            menu: 'ShiftAndDepartmentWiseAttendanceCountReport',
            to: `${adminRoot}/reports/shiftDepartmentwise_attendance_count_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'User Document Expiry  Report',
            menu: 'UserDocumentExpiryReport',
            to: `${adminRoot}/reports/UserDocument_Expiry`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Monthly Salary Summary Register',
            menu: 'MonthlySalarySummaryRegister',
            to: `${adminRoot}/reports/monthly_salary_summary`,
          },
          {
            icon: 'iconsminds-network',
            label: 'WeekOff Day Work Report',
            menu: 'WeekOffDayWorkReport',
            to: `${adminRoot}/reports/weekoff_day_work_Report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Outdoor Duty Application Report',
            menu: 'OutdoorDutyApplicationReport',
            to: `${adminRoot}/reports/outdoor_duty_application_Report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Attendance Timing Report',
            menu: 'AttendanceTimingReport',
            to: `${adminRoot}/reports/attendance_timing_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Slot Wise Attendance Report',
            menu: 'SlotWiseAttendanceReport',
            to: `${adminRoot}/reports/slot_wise_attendance_report`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Short Leave Application Report',
            menu: 'ShortLeaveApplicationReport',
            to: `${adminRoot}/reports/short_leave_application_report`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Salary Wages Sheet',
            menu: 'SalaryWagesSheet',
            to: `${adminRoot}/reports/wages_sheet`,
          },

          {
            icon: 'iconsminds-network',
            label: 'Service Charges Bill',
            menu: 'ServiceChargesBill',
            to: `${adminRoot}/reports/service_charges_bill`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Labour Charges Bill',
            menu: 'LabourChargesBill',
            to: `${adminRoot}/reports/labour_charges_bill`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Overtime Sheet With ESIC',
            menu: 'OvertimeSheetWithESIC',
            to: `${adminRoot}/reports/ot_report_with_esic`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Salary Summary',
            menu: 'SalarySummary',
            to: `${adminRoot}/reports/salarySummary`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Bonus Report',
            menu: 'BonusReport',
            to: `${adminRoot}/reports/bonusReport`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Professional Tax Register',
            menu: 'ProfessionalTaxRegister',
            to: `${adminRoot}/reports/pt_register`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Attendance Correction Request Report',
            menu: 'AttendanceCorrectionRequestReport',
            to: `${adminRoot}/reports/attendanceCorrectionReport`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Expense Claim Report',
            menu: 'ExpenseClaimReport',
            to: `${adminRoot}/reports/expenseClaimReport`,
          },
          {
            icon: 'iconsminds-optimization',
            label: 'Expense Report MARS',
            menu: 'ExpenseReportMARS',
            to: `${adminRoot}/reports/expenseReportMARS`,
          },
          {
            icon: 'iconsminds-network',
            label: 'Completed Tenure Report',
            menu: 'CompletedTenureReport',
            to: `${adminRoot}/reports/completedTenureReport`,
          },
        ],
      },
      {
        icon: 'iconsminds-the-white-house',
        label: 'Govt. Report',
        menu: 'GovernmentReport',
        to: `${adminRoot}/govtreports`,
        subs: [
          {
            icon: 'iconsminds-the-white-house',
            label: 'Govt. Report',
            menu: 'GovernmentReport',
            to: `${adminRoot}/govtreports/govreport_master`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Adult Worker Register',
            menu: 'AdultWorkerRegistery',
            to: `${adminRoot}/govtreports/adultworkersregister`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Form D Attedance Register',
            menu: 'Form-D-Attedance-Register',
            to: `${adminRoot}/govtreports/inout-attendance-register`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Form-XVI Muster Roll',
            menu: 'Form-XVI',
            to: `${adminRoot}/govtreports/pa-muster-roll`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'Form 1',
            menu: 'Form-1',
            to: `${adminRoot}/govtreports/form1`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 5',
            menu: 'Form-5',
            to: `${adminRoot}/govtreports/form5`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 11',
            menu: 'Form-11',
            to: `${adminRoot}/govtreports/form11`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 14',
            menu: 'Form-14',
            to: `${adminRoot}/govtreports/form14`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 18',
            menu: 'Form-18',
            to: `${adminRoot}/govtreports/form18`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 21',
            menu: 'Form-21',
            to: `${adminRoot}/govtreports/form21`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 29',
            menu: 'Form-29',
            to: `${adminRoot}/govtreports/form29`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 4',
            menu: 'Form-4',
            to: `${adminRoot}/govtreports/form4`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 7',
            menu: 'Form-7',
            to: `${adminRoot}/govtreports/form7`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form A',
            menu: 'Form-A',
            to: `${adminRoot}/govtreports/formA`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form B',
            menu: 'Form-B',
            to: `${adminRoot}/govtreports/formB`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form C',
            menu: 'Form-C',
            to: `${adminRoot}/govtreports/formC`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form ER-01',
            menu: 'Form-ER-01',
            to: `${adminRoot}/govtreports/form-er01`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'LWF Report',
            menu: 'LWFReport',
            to: `${adminRoot}/govtreports/lwf_report`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Id Card Register',
            menu: 'IdCardRegistery',
            to: `${adminRoot}/govtreports/identitycardregister`,
          },
        ],
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Form-16',
        menu: 'Form16',
        to: `${adminRoot}/form16s`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'Form-16',
            menu: 'Form16',
            to: `${adminRoot}/form16s/form16_master`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Employee Investment',
            menu: 'Investment',
            to: `${adminRoot}/form16s/employee_investment`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Tax Challan',
            menu: 'TaxChallan',
            to: `${adminRoot}/form16s/tax_challan`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Quater Tax Challan',
            menu: 'QuaterTaxChallan',
            to: `${adminRoot}/form16s/quater_tax_challan`,
          },

          {
            icon: 'iconsminds-notepad',
            label: 'TDS Slab',
            menu: 'TdsSlab',
            to: `${adminRoot}/form16s/tds_slab`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Form 16 Report',
            menu: 'TdsSlab',
            to: `${adminRoot}/form16s/form16report`,
          },
        ],
      },

      {
        icon: 'iconsminds-id-card',
        label: 'Gate Pass',
        menu: 'GatePass',
        to: `${adminRoot}/gatepasses`,
        subs: [
          {
            icon: 'iconsminds-id-card',
            label: 'Gate Pass',
            menu: 'GatePass',
            to: `${adminRoot}/gatepasses/gatepass_master`,
          },
          {
            icon: 'iconsminds-newspaper',
            label: 'My Gate Pass',
            menu: 'MyGatePass',
            to: `${adminRoot}/gatepasses/mygatepass`,
          },
          {
            icon: 'iconsminds-id-card',
            label: 'Gate Pass Dashboard',
            menu: 'GatePassEntry',
            to: `${adminRoot}/gatepasses/gatepass-dashboard`,
          },
          {
            icon: 'iconsminds-id-card',
            label: 'Gate Pass',
            menu: 'GatePassEntry',
            to: `${adminRoot}/gatepasses/gatepass`,
          },
        ],
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Skillsets',
        menu: 'SkillSets',
        to: `${adminRoot}/skillsets`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'Skillsets',
            menu: 'SkillSets',
            to: `${adminRoot}/skillsets/skillsets_master`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Skillsets',
            menu: 'SkillSetsQuestions',
            to: `${adminRoot}/skillsets/skillset`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Skillsets Form',
            menu: 'SkillSetsForm',
            to: `${adminRoot}/skillsets/skillsetform`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Generate Monthly Skillsets Form',
            menu: 'GenerateMonthlySkillSetsForm',
            to: `${adminRoot}/skillsets/monthlySkillsetform`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'My Skillsets Form',
            menu: 'MySkillSetsForm',
            to: `${adminRoot}/skillsets/user-skillsets-form`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Skillsets Authorization Form',
            menu: 'SkillSetsFormAuthorization',
            to: `${adminRoot}/skillsets/field-skillsets-form`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Skillsets Report',
            menu: 'SkillSetsReport',
            to: `${adminRoot}/skillsets/skillsetsReport`,
          },
        ],
      },
      {
        icon: 'iconsminds-notepad',
        label: 'Ticket',
        menu: 'Ticket',
        to: `${adminRoot}/tickets`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'Ticket',
            menu: 'Ticket',
            to: `${adminRoot}/tickets/ticketMaster`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Ticket Dashboard',
            menu: 'TicketDashboard',
            to: `${adminRoot}/tickets/ticketDashboard`,
          },
          {
            icon: 'iconsminds-paper',
            label: 'Ticket',
            menu: 'Ticket',
            to: `${adminRoot}/tickets/listTicket`,
          },
          {
            icon: 'iconsminds-on-off-2',
            label: 'Ticket Category',
            menu: 'TicketCategory',
            to: `${adminRoot}/tickets/listTicketCategory`,
          },

          {
            icon: 'simple-icon-grid',
            label: 'Ticket Sub Category',
            menu: 'TicketSubcategory',
            to: `${adminRoot}/tickets/listTicketSubCategory`,
          },
        ],
      },
      {
        icon: 'iconsminds-notepad',
        label: 'CheckList',
        menu: 'CheckList',
        to: `${adminRoot}/checklists`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'CheckList',
            menu: 'CheckList',
            to: `${adminRoot}/checklists/checklist_master`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Check List',
            menu: 'CheckListMaster',
            to: `${adminRoot}/checklists/checklist`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Check List Questions',
            menu: 'CheckListQuestion',
            to: `${adminRoot}/checklists/checklistQuestion`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'My Check List',
            menu: 'MyCheckList',
            to: `${adminRoot}/checklists/userCheckList`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Admin CheckList',
            menu: 'AdminCheckList',
            to: `${adminRoot}/checklists/checklistadmin`,
          },
        ],
      },
      {
        icon: 'iconsminds-id-card',
        label: 'Utility',
        menu: 'Utility',
        to: `${adminRoot}/utilitys`,
      },
      {
        icon: 'iconsminds-id-card',
        label: 'Mood Tracker',
        menu: 'MoodTracker',
        to: `${adminRoot}/moodTrackers`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'Mood Tracker',
            menu: 'MoodTracker',
            to: `${adminRoot}/moodTrackers/moodTracker_master`,
          },
          {
            icon: 'iconsminds-conference',
            label: 'Sentiment Report',
            menu: 'SentimentReport',
            to: `${adminRoot}/moodTrackers/sentimentsReport`,
          },
          {
            icon: 'iconsminds-conference',
            label: 'Sentiments Analysis Dashboard',
            menu: 'SentimentDashboard',
            to: `${adminRoot}/moodTrackers/sentimentsAnalysisDashboard`,
          },
          {
            icon: 'iconsminds-conference',
            label: 'My Sentiments',
            menu: 'MySentiment',
            to: `${adminRoot}/moodTrackers/mysentiments`,
          },
        ],
      },

      {
        icon: 'iconsminds-embassy',
        label: 'PMS',
        menu: 'PMS',
        to: `${adminRoot}/pms`,
        // roles: [UserRole.Admin],
        subs: [
          {
            icon: 'iconsminds-books',
            label: 'Pms Master',
            menu: 'PMS',
            to: `${adminRoot}/pms/pms_master`,
          },
          {
            icon: 'iconsminds-books',
            label: 'Goal',
            menu: 'Goal',
            to: `${adminRoot}/pms/goal`,
          },
          {
            icon: 'iconsminds-books',
            label: 'Employee Goal',
            menu: 'AssignGoalToEmployee',
            to: `${adminRoot}/pms/empgoal`,
          },
          {
            icon: 'iconsminds-books',
            label: 'Goal Settings',
            menu: 'GoalSetting',
            to: `${adminRoot}/pms/goalsetting`,
          },
          {
            icon: 'iconsminds-books',
            label: 'KRA',
            menu: 'KRA',
            to: `${adminRoot}/pms/kra`,
          },
          {
            icon: 'iconsminds-books',
            label: 'KPI',
            menu: 'KPI',
            to: `${adminRoot}/pms/kpi`,
          },
          {
            icon: 'iconsminds-books',
            label: 'PMS Policy',
            menu: 'PMSPolicy',
            to: `${adminRoot}/pms/pmspolicy`,
          },
          {
            icon: 'simple-icon-grid',
            label: 'Designation Wise Goal Review Report',
            menu: 'DesignationWiseGoalReviewReport',
            to: `${adminRoot}/pms/designationWiseReport`,
          },
          {
            icon: 'simple-icon-grid',
            label: 'Goal Review',
            menu: 'GoalReview',
            to: `${adminRoot}/pms/goalReview`,
          },
          {
            icon: 'simple-icon-grid',
            label: 'Review Form',
            menu: 'ReviewForm',
            to: `${adminRoot}/pms/reviewform`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Performance Review',
            menu: 'ReviewForm',
            to: `${adminRoot}/pms/performanceReview`,
          },
          {
            icon: 'simple-icon-grid',
            label: 'Set Performance Review',
            menu: 'ReviewForm',
            to: `${adminRoot}/pms/setPerformanceReview`,
          },
          {
            icon: 'simple-icon-grid',
            label: 'Review Request',
            menu: 'ReviewForm',
            to: `${adminRoot}/pms/reviewRequest`,
          },
          {
            icon: 'simple-icon-grid',
            label: 'Performance Review Report',
            menu: 'ReviewForm',
            to: `${adminRoot}/pms/performanceReviewReport`,
          },
        ],
      },
      {
        icon: 'iconsminds-id-card',
        label: 'Income Tax',
        menu: 'IncomeTax',
        to: `${adminRoot}/incometax`,
        subs: [
          {
            icon: 'iconsminds-notepad',
            label: 'Income Tax Master',
            menu: 'IncomeTax',
            to: `${adminRoot}/incometax/incometax_master`,
          },

          // {
          //   icon: 'iconsminds-notepad',
          //   label: 'Employee Invesments',
          //   menu: 'MoodTracker',
          //   to: `${adminRoot}/incometax/list_emp_investment`,
          // },

          {
            icon: 'iconsminds-notepad',
            label: 'My Income Tax Regime',
            menu: 'MyIncomeTaxRegime',
            to: `${adminRoot}/incometax/list_my_incometax_regime`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Employee Tax Regime',
            menu: 'EmployeeIncomeTaxRegime',
            to: `${adminRoot}/incometax/list_employee_tax_regime`,
          },

          // {
          //   icon: 'iconsminds-notepad',
          //   label: 'My IncomeTax Declaration',
          //   menu: 'MyIncometaxDeclaration',
          //   to: `${adminRoot}/incometax/incometax_declaration`,
          // },

          {
            icon: 'iconsminds-notepad',
            label: 'IncomeTax Declaration Request',
            menu: 'IncometaxDeclarationRequest',
            to: `${adminRoot}/incometax/incometax_declaration_request`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Monthly Tax deductions Of Employees',
            menu: 'MonthlyTaxDeductionsOfEmployees',
            to: `${adminRoot}/incometax/monthlyTax_Deductions_Of_employees`,
          },
          {
            icon: 'iconsminds-notepad',
            label: 'Employee Declaration Report',
            menu: 'EmployeeDeclarationReport',
            to: `${adminRoot}/incometax/employee-declaration-report`,
          },
        ],
      },

      {
        icon: 'iconsminds-id-card',
        label: 'Employee Gate Pass',
        menu: 'EmployeeGatepass',
        to: `${adminRoot}/employeegatepasses`,
        subs: [
          {
            icon: 'iconsminds-id-card',
            label: 'Employee Gate Pass',
            menu: 'EmployeeGatepass',
            to: `${adminRoot}/employeegatepasses/employee_gatepass_master`,
          },
          {
            icon: 'iconsminds-newspaper',
            label: 'Employee Gate Pass',
            menu: 'AllEmployeeGatepass',
            to: `${adminRoot}/employeegatepasses/list_empgatepass`,
          },
          {
            icon: 'iconsminds-newspaper',
            label: 'Gatepass Request',
            menu: 'EmployeeGatepassRequest',
            to: `${adminRoot}/employeegatepasses/gatepassRequest`,
          },
          {
            icon: 'iconsminds-newspaper',
            label: 'My Gatepass',
            menu: 'MyEmployeeGatepass',
            to: `${adminRoot}/employeegatepasses/list_mygatepass`,
          },
        ],
      },
    ];
    data1 = data;
  }
  return data1;
};

export default getHeaderItems;
