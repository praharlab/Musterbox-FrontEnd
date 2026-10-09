import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormEr01MasterRoutingModule } from './form-er01-master-routing.module';
import { FormER01Component } from './form-er01.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [FormER01Component],
  imports: [
    CommonModule,
    FormEr01MasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class FormEr01MasterModule { }
