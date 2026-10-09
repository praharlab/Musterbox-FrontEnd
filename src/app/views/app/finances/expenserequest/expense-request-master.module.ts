import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseRequestMasterRoutingModule } from './expense-request-master-routing.module';
import { ExpenserequestComponent } from './expenserequest.component';
import { EditExpenserequestComponent } from './edit-expenserequest/edit-expenserequest.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { FinanceCommonModule } from '../../finance-common/finance-common.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ViewFinanceTransCommonModule } from '../view-finance-trans-common/view-finance-trans-common.module';
import { ViewExpenseCommonModule } from '../view-expense-common/view-expense-common.module';
import { ExpReqTableComponent } from './exp-req-table/exp-req-table.component';


@NgModule({
  declarations: [ExpenserequestComponent, EditExpenserequestComponent, ExpReqTableComponent],
  imports: [
    CommonModule,
    ExpenseRequestMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    TabsModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
    FinanceCommonModule,
    SimpleNotificationsModule.forRoot(),
    ViewFinanceTransCommonModule,
    ViewExpenseCommonModule
  ]
})
export class ExpenseRequestMasterModule { }
