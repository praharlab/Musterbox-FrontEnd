import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EMailSalarySlipMasterRoutingModule } from './e-mail-salary-slip-master-routing.module';
import { EMailSalarySlipComponent } from './e-mail-salary-slip.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [EMailSalarySlipComponent],
  imports: [
    CommonModule,
    EMailSalarySlipMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class EMailSalarySlipMasterModule { }
