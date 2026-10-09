import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkShortLeaveApplicationRoutingModule } from './bulk-short-leave-application-routing.module';
import { AddBulkShortLeaveApplicationComponent } from './add-bulk-short-leave-application/add-bulk-short-leave-application.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [AddBulkShortLeaveApplicationComponent],
  imports: [
    CommonModule,
    BulkShortLeaveApplicationRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class BulkShortLeaveApplicationModule { }
