import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryRegisterWithDateOfPayMasterRoutingModule } from './salary-register-with-date-of-pay-master-routing.module';
import { SalaryRegisterWithDateOfPayComponent } from './salary-register-with-date-of-pay.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [SalaryRegisterWithDateOfPayComponent],
  imports: [
    CommonModule,
    SalaryRegisterWithDateOfPayMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
  ]
})
export class SalaryRegisterWithDateOfPayMasterModule { }
