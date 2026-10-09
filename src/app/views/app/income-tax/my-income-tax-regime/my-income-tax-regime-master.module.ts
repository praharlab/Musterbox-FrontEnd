import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyIncomeTaxRegimeMasterRoutingModule } from './my-income-tax-regime-master-routing.module';
import { ListMyIncomeTaxRegimeComponent } from './list-my-income-tax-regime/list-my-income-tax-regime.component';
import { AddMyIncomeTaxRegimeComponent } from './add-my-income-tax-regime/add-my-income-tax-regime.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListMyIncomeTaxRegimeComponent, AddMyIncomeTaxRegimeComponent],
  imports: [
    CommonModule,
    MyIncomeTaxRegimeMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class MyIncomeTaxRegimeMasterModule { }
