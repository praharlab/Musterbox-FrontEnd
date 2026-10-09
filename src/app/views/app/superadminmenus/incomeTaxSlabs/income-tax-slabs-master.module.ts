import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeTaxSlabsMasterRoutingModule } from './income-tax-slabs-master-routing.module';
import { ListIncomeTaxSlabComponent } from './list-income-tax-slab/list-income-tax-slab.component';
import { AddIncomeTaxSlabComponent } from './add-income-tax-slab/add-income-tax-slab.component';
import { EditIncomeTaxSlabComponent } from './edit-income-tax-slab/edit-income-tax-slab.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListIncomeTaxSlabComponent, AddIncomeTaxSlabComponent, EditIncomeTaxSlabComponent],
  imports: [
    CommonModule,
    IncomeTaxSlabsMasterRoutingModule,
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
export class IncomeTaxSlabsMasterModule { }
