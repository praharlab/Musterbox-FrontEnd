import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form1MasterRoutingModule } from './form1-master-routing.module';
import { Form1Component } from './form1.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [Form1Component],
  imports: [
    CommonModule,
    Form1MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form1MasterModule { }
