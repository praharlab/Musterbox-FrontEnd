import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankStatementFormatComponent } from './bank-statement-format/bank-statement-format.component';
import { CreateBankStatementFormatComponent } from './create-bank-statement-format/create-bank-statement-format.component';
import { EditBankStatementFormatComponent } from './edit-bank-statement-format/edit-bank-statement-format.component';


const routes: Routes = [
  { path: '', component: BankStatementFormatComponent },
  { path: 'add', component: CreateBankStatementFormatComponent },
  { path: 'edit', component: EditBankStatementFormatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankStatementFormatRoutingModule { }
