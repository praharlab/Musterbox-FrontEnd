import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HourlySalaryRegisterMasterRoutingModule } from './hourly-salary-register-master-routing.module';
import { HourlySalaryRegisterComponent } from './hourly-salary-register.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [HourlySalaryRegisterComponent],
  imports: [
    CommonModule,
    HourlySalaryRegisterMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class HourlySalaryRegisterMasterModule { }
