import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkEmpFoodAllowanceMasterRoutingModule } from './bulk-emp-food-allowance-master-routing.module';
import { BulkAddEmployeeFoodAllowancePolicyComponent } from './bulk-add-employee-food-allowance-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [BulkAddEmployeeFoodAllowancePolicyComponent],
  imports: [
    CommonModule,
    BulkEmpFoodAllowanceMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    LayoutContainersModule,
    TranslateModule,
    PaginationModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class BulkEmpFoodAllowanceMasterModule { }
