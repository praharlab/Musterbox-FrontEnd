import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkAddEmployeeBonusPolicyRoutingModule } from './bulk-add-employee-bonus-policy-routing.module';
import { BulkAddEmployeeBonusPolicyComponent } from './bulk-add-employee-bonus-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [BulkAddEmployeeBonusPolicyComponent],
  imports: [
    CommonModule,
    BulkAddEmployeeBonusPolicyRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    ModalModule
  ]
})
export class BulkAddEmployeeBonusPolicyModule { }
