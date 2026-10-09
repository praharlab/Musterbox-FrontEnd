import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form14MasterRoutingModule } from './form14-master-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { Form14Component } from './form14.component';


@NgModule({
  declarations: [Form14Component],
  imports: [
    CommonModule,
    Form14MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form14MasterModule { }
