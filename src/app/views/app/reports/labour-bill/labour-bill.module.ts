import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabourBillRoutingModule } from './labour-bill-routing.module';
import { LabourBillComponent } from './labour-bill.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [LabourBillComponent],
  imports: [
    CommonModule,
    LabourBillRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class LabourBillModule { }
