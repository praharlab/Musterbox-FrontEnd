import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OvertimeCalculationMasterRoutingModule } from './overtime-calculation-master-routing.module';
import { OvertimeCalculationComponent } from './overtime-calculation.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [OvertimeCalculationComponent],
  imports: [
    CommonModule,
    OvertimeCalculationMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule
  ]
})
export class OvertimeCalculationMasterModule { }
