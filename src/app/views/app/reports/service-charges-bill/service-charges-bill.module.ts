import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceChargesBillRoutingModule } from './service-charges-bill-routing.module';
import { ServiceChargesBillComponent } from './service-charges-bill.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ServiceChargesBillComponent],
  imports: [
    CommonModule,
    ServiceChargesBillRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class ServiceChargesBillModule { }
