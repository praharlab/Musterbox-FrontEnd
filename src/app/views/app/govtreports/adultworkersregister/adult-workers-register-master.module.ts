import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdultWorkersRegisterMasterRoutingModule } from './adult-workers-register-master-routing.module';
import { AdultworkersregisterComponent } from './adultworkersregister.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AdultworkersregisterComponent],
  imports: [
    CommonModule,
    AdultWorkersRegisterMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class AdultWorkersRegisterMasterModule { }
