import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form28MasterRoutingModule } from './form28-master-routing.module';
import { Form28Component } from './form28.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  declarations: [Form28Component],
  imports: [
    CommonModule,
    Form28MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule,
    NgxPrintModule
  ]
})
export class Form28MasterModule { }
