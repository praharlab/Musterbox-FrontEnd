import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositUserwiseMasterRoutingModule } from './deposit-userwise-master-routing.module';
import { DepositUserwiseComponent } from './deposit-userwise.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [DepositUserwiseComponent],
  imports: [
    CommonModule,
    DepositUserwiseMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class DepositUserwiseMasterModule { }
