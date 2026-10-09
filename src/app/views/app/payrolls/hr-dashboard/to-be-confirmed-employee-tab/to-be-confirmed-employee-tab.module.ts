import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToBeConfirmedEmployeeTabRoutingModule } from './to-be-confirmed-employee-tab-routing.module';
import { ToBeConfirmedEmployeeTabComponent } from './to-be-confirmed-employee-tab.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [ToBeConfirmedEmployeeTabComponent],
  imports: [
    CommonModule,
    ToBeConfirmedEmployeeTabRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule
  ]
})
export class ToBeConfirmedEmployeeTabModule { }
