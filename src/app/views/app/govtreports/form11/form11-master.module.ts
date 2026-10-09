import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form11MasterRoutingModule } from './form11-master-routing.module';
import { Form11Component } from './form11.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [Form11Component],
  imports: [
    CommonModule,
    Form11MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class Form11MasterModule { }
