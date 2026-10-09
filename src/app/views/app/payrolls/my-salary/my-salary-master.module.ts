import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySalaryMasterRoutingModule } from './my-salary-master-routing.module';
import { MySalaryComponent } from './my-salary.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [MySalaryComponent],
  imports: [
    CommonModule,
    MySalaryMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    ModalModule
  ]
})
export class MySalaryMasterModule { }
