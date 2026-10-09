import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeePolicyMasterRoutingModule } from './employee-policy-master-routing.module';
import { EmployeePolicyComponent } from './employee-policy.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [EmployeePolicyComponent],
  imports: [
    CommonModule,
    EmployeePolicyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    LayoutContainersModule,
    CommonFilterModule
  ]
})
export class EmployeePolicyMasterModule { }
