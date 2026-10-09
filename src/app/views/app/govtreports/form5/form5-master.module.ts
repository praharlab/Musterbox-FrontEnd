import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form5MasterRoutingModule } from './form5-master-routing.module';
import { Form5Component } from './form5.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [Form5Component],
  imports: [
    CommonModule,
    Form5MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form5MasterModule { }
