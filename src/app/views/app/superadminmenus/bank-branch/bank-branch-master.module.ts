import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankBranchMasterRoutingModule } from './bank-branch-master-routing.module';
import { ListBankBranchComponent } from './list-bank-branch/list-bank-branch.component';
import { AddBankBranchComponent } from './add-bank-branch/add-bank-branch.component';
import { EditBankBranchComponent } from './edit-bank-branch/edit-bank-branch.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListBankBranchComponent, AddBankBranchComponent, EditBankBranchComponent],
  imports: [
    CommonModule,
    BankBranchMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BankBranchMasterModule { }
