import { NgModule } from '@angular/core';

import { GatepassesRoutingModule } from './gatepasses.routing';

import { GatepassesComponent } from './gatepasses.component';
import { GatePassMasterComponent } from './gate-pass-master/gate-pass-master.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  declarations: [
    GatepassesComponent,
    GatePassMasterComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    GatepassesRoutingModule,
    LayoutContainersModule,
    NgxUiLoaderModule,
  ],
})
export class GatepassesModule {}
