import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form18MasterRoutingModule } from './form18-master-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { Form18Component } from './form18.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [Form18Component],
  imports: [
    CommonModule,
    Form18MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form18MasterModule { }
