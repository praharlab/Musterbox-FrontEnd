import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form29MasterRoutingModule } from './form29-master-routing.module';
import { Form29Component } from './form29.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [Form29Component],
  imports: [
    CommonModule,
    Form29MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form29MasterModule { }
