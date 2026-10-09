import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form4MasterRoutingModule } from './form4-master-routing.module';
import { Form4Component } from './form4.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [Form4Component],
  imports: [
    CommonModule,
    Form4MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form4MasterModule { }
