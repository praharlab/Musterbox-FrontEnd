import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-myfinancesmaster',
    templateUrl: './myfinancesmaster.component.html',
    styleUrls: ['./myfinancesmaster.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyfinancesmasterComponent implements OnInit {
  formdata: any = [];
  visible: Boolean = false;
  MyFinancesArray: any = [];

  FinancesArray: any = [];

  ExpenseArray: any = [];
  
  officeExpenseArray: any = [];
  
  ErpArray: any = [];

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

    this.MyFinancesArray = [
      {
        icon: 'iconsminds-money-bag',
        label: 'My Advance Payment',
        menu: 'EmployeeAdvance',
        to: `${this.adminRoot}/finances/advancePaymentNew`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'My Deposit',
        menu: 'EmployeeDeposit',
        to: `${this.adminRoot}/finances/depositUserwise`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'My Expense',
        menu: 'Expense',
        to: `${this.adminRoot}/finances/expense`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'My Loan',
        menu: 'EmployeeLoan',
        to: `${this.adminRoot}/finances/loanUserwise`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'My Penalty',
        menu: 'EmployeePenalty',
        to: `${this.adminRoot}/finances/penaltyUserwise`,
      },

      {
        icon: 'iconsminds-money-bag',
        label: 'My Incentive',
        menu: 'MyIncentive',
        to: `${this.adminRoot}/finances/my_incentive`,
      },
    ];

    this.FinancesArray = [
      {
        icon: 'iconsminds-increase-inedit',
        label: 'Team Advance Request',
        menu: 'TeamAdvanceRequest',
        to: `${this.adminRoot}/finances/teamAdvanceRequest`,
      },
      {
        icon: 'iconsminds-increase-inedit',
        label: 'Advance Payment',
        menu: 'AdvancePayment',
        to: `${this.adminRoot}/finances/advancePayment`,
      },
      {
        icon: 'iconsminds-male-2',
        label: 'Deposit',
        menu: 'Deposit',
        to: `${this.adminRoot}/finances/deposit`,
      },

      {
        icon: 'iconsminds-bank',
        label: 'Loan',
        menu: 'LoanMaster',
        to: `${this.adminRoot}/finances/loanMaster`,
      },

      {
        icon: 'iconsminds-male',
        label: 'Penalty',
        menu: 'AssignPenaltyEmp',
        to: `${this.adminRoot}/finances/employeepenalty`,
      },
    ];

    this.ExpenseArray = [
      {
        icon: 'iconsminds-money-bag',
        label: 'Expense Request',
        menu: 'ExpenseRequest',
        to: `${this.adminRoot}/finances/expense_request`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'Expense Payment',
        menu: 'ExpensePayment',
        to: `${this.adminRoot}/finances/expense_payment`,
      },

      {
        icon: 'iconsminds-money-bag',
        label: 'List Paid Expense',
        menu: 'ExpensePayment',
        to: `${this.adminRoot}/finances/list_paid_expense`,
      },
      {
        icon: 'iconsminds-money-bag',
        label: 'Advance Expense Payment ',
        menu: 'ExpensePayment',
        to: `${this.adminRoot}/finances/list_advance_payment`,
      },
    ];

    this.officeExpenseArray = [
      {
        icon: 'iconsminds-money-bag',
        label: 'Office Expense',
        menu: 'OfficeExpense',
        to: `${this.adminRoot}/finances/officeExpense`,
      },
      {
        icon: 'iconsminds-male',
        label: 'Allocate Office Expense Rights',
        menu: 'AllocateOfficeExpenseRights',
        to: `${this.adminRoot}/finances/allocateOfcExpRights`,
      },
      {
        icon: 'iconsminds-male',
        label: 'Office Expense Request',
        menu: 'OfficeExpenseRequest',
        to: `${this.adminRoot}/finances/officeExpRequest`,
      },
      {
        icon: 'iconsminds-male',
        label: 'Office Expense Advance',
        menu: 'OfficeExpenseAdvance',
        to: `${this.adminRoot}/finances/officeExpenseAdvance`,
      },
    ]

    this.ErpArray = [
      {
        icon: 'iconsminds-link',
        label: 'Erp Account Link',
        menu: 'ErpAccountLink',
        to: `${this.adminRoot}/finances/erpAccountMaster`,
      },
      {
        icon: 'iconsminds-sync',
        label: 'Erp Sync',
        menu: 'ErpSync',
        to: `${this.adminRoot}/finances/erpsync`,
      },
      {
        icon: 'iconsminds-link',
        label: 'SN Codes',
        menu: 'SNCode',
        to: `${this.adminRoot}/finances/sn_codes`,
      },
    ];
  }
}
