import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancesComponent } from './finances.component';
import { MyfinancesmasterComponent } from './myfinancesmaster/myfinancesmaster.component';
import { ReapplyComponent } from './expense/reapply/reapply.component';
import { AddLoanAdvanceComponent } from './loanMaster/add-loan-advance/add-loan-advance.component';
import { ListloanAdvanceComponent } from './loanMaster/listloan-advance/listloan-advance.component';
import { ApproveReqAdvPayComponent } from './advancePayment/approve-req-adv-pay/approve-req-adv-pay.component';
import { CompanyExpenseDataComponent } from './company-expense-data/company-expense-data.component';
import { CompnayLoanDataComponent } from './loanMaster/compnay-loan-data/compnay-loan-data.component';
import { CompanyAdvancePaymentComponent } from './advancePayment/company-advance-payment/company-advance-payment.component';

const routes: Routes = [
  {
    path: '',
    component: FinancesComponent,
    children: [
      { path: '', redirectTo: 'myfinances_master', pathMatch: 'full' },

      { path: 'myfinances_master', component: MyfinancesmasterComponent },

      {
        path: 'advancePaymentNew',
        loadChildren: () =>
          import('./advancePaymentNew/advance-payment-new-master.module').then(
            (m) => m.AdvancePaymentNewMasterModule,
          ),
      },

      {
        path: 'depositUserwise',
        loadChildren: () =>
          import('./deposit-userwise/deposit-userwise-master.module').then(
            (m) => m.DepositUserwiseMasterModule,
          ),
      },

      {
        path: 'expense',
        loadChildren: () =>
          import('./expense/expense-master.module').then((m) => m.ExpenseMasterModule),
      },

      { path: 'reapply', component: ReapplyComponent },

      {
        path: 'loanUserwise',
        loadChildren: () =>
          import('./loan-userwise/loan-userwise-master.module').then(
            (m) => m.LoanUserwiseMasterModule,
          ),
      },

      {
        path: 'penaltyUserwise',
        loadChildren: () =>
          import('./penalty-userwise/penalty-userwise-master.module').then(
            (m) => m.PenaltyUserwiseMasterModule,
          ),
      },

      {
        path: 'expense_request',
        loadChildren: () =>
          import('./expenserequest/expense-request-master.module').then(
            (m) => m.ExpenseRequestMasterModule,
          ),
      },

      {
        path: 'expense_payment',
        loadChildren: () =>
          import('./expense-payment/expense-payment-master.module').then(
            (m) => m.ExpensePaymentMasterModule,
          ),
      },

      {
        path: 'list_paid_expense',
        loadChildren: () =>
          import('./paid-expense-list/paid-expense-list-master.module').then(
            (m) => m.PaidExpenseListMasterModule,
          ),
      },

      {
        path: 'advancePayment',
        loadChildren: () =>
          import('./advancePayment/advance-payment-master.module').then(
            (m) => m.AdvancePaymentMasterModule,
          ),
      },

      {
        path: 'deposit',
        loadChildren: () =>
          import('./deposit/deposit-master.module').then((m) => m.DepositMasterModule),
      },

      {
        path: 'loanMaster',
        loadChildren: () =>
          import('./loanMaster/loan-master.module').then((m) => m.LoanMasterModule),
      },

      { path: 'add_loanAdvance', component: AddLoanAdvanceComponent },
      { path: 'loanAdvance', component: ListloanAdvanceComponent },

      {
        path: 'employeepenalty',
        loadChildren: () =>
          import('./emppenalty/emp-penalty-master.module').then((m) => m.EmpPenaltyMasterModule),
      },

      {
        path: 'erpAccountMaster',
        loadChildren: () =>
          import('./erpAccountMaster/erp-account-master.module').then(
            (m) => m.ErpAccountMasterModule,
          ),
      },

      {
        path: 'erpsync',
        loadChildren: () =>
          import('./erpsync/erp-sync-master.module').then((m) => m.ErpSyncMasterModule),
      },

      { path: 'approve_req_advancePayment', component: ApproveReqAdvPayComponent }, // advance

      { path: 'company_loandata', component: CompnayLoanDataComponent }, // hr dashboard request box for pending,accept,reject
      { path: 'company_expensedata', component: CompanyExpenseDataComponent }, // hr dashboard request box for pending,accept,reject
      { path: 'company_advancedata', component: CompanyAdvancePaymentComponent }, // hr dashboard request box for pending,accept,reject

      {
        path: 'sn_codes',
        loadChildren: () =>
          import('./sn_codes/sn-codes-master.module').then((m) => m.SnCodesMasterModule),
      },

      {
        path: 'my_incentive',
        loadChildren: () =>
          import('./my-incentive/my-incentive-master.module').then(
            (m) => m.MyIncentiveMasterModule,
          ),
      },

      {
        path: 'list_advance_payment',
        loadChildren: () =>
          import('./advance-expense-payment/advance-expense-payment-master.module').then(
            (m) => m.AdvanceExpensePaymentMasterModule,
          ),
      },

      {
        path: 'teamAdvanceRequest',
        loadChildren: () =>
          import('./team-advance-request/team-advance-request.module').then(
            (m) => m.TeamAdvanceRequestModule,
          ),
      },
      
      { path: 'officeExpense', loadChildren: () => import('./office-expense/office-expense.module').then((m) => m.OfficeExpenseModule) },

      { path: 'allocateOfcExpRights', loadChildren: () => import('./allocate-ofc-expense-rights/allocate-ofc-expense-rights.module').then((m) => m.AllocateOfcExpenseRightsModule) },

      { path: 'officeExpRequest', loadChildren: () => import('./office-expense-request/office-expense-request.module').then((m) => m.OfficeExpenseRequestModule) },

      { path: 'officeExpenseAdvance', loadChildren: () => import('./office-expense-advance/office-expense-advance.module').then((m) => m.OfficeExpenseAdvanceModule) }
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancesRoutingModule {}
