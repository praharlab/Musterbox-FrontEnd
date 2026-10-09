import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkSalarySlipDownloadMasterRoutingModule } from './bulk-salary-slip-download-master-routing.module';
import { BulkSlarySlipDownloadComponent } from './bulk-slary-slip-download.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [BulkSlarySlipDownloadComponent],
  imports: [
    CommonModule,
    BulkSalarySlipDownloadMasterRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule
  ]
})
export class BulkSalarySlipDownloadMasterModule { }
