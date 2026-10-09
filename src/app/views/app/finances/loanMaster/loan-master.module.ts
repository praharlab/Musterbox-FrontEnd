import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanMasterRoutingModule } from './loan-master-routing.module';
import { ListLoanMasterComponent } from './list-loan-master/list-loan-master.component';
import { EditLoanMasterComponent } from './edit-loan-master/edit-loan-master.component';
import { AddLoanMasterComponent } from './add-loan-master/add-loan-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FinanceCommonModule } from '../../finance-common/finance-common.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListLoanMasterComponent, EditLoanMasterComponent, AddLoanMasterComponent],
  imports: [
    CommonModule,
    LoanMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    FinanceCommonModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class LoanMasterModule { }
