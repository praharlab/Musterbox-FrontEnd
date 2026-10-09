import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeTaxSlabMasterRoutingModule } from './income-tax-slab-master-routing.module';
import { ListIncomeTaxSlabMasterComponent } from './list-income-tax-slab-master/list-income-tax-slab-master.component';
import { AddIncomeTaxSlabMasterComponent } from './add-income-tax-slab-master/add-income-tax-slab-master.component';
import { EditIncomeTaxSlabMasterComponent } from './edit-income-tax-slab-master/edit-income-tax-slab-master.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ListIncomeTaxSlabMasterComponent, AddIncomeTaxSlabMasterComponent, EditIncomeTaxSlabMasterComponent],
  imports: [
    CommonModule,
    IncomeTaxSlabMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    NgSelectModule
  ]
})
export class IncomeTaxSlabMasterModule { }
