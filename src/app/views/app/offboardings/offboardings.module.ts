import { NgModule } from '@angular/core';

import { OffboardingsRoutingModule } from './offboardings.routing';
import { OffboardingsComponent } from './offboardings.component';
import { OffBoardingMasterComponent } from './off-boarding-master/off-boarding-master.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

@NgModule({
  declarations: [
    OffboardingsComponent,
    OffBoardingMasterComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AngularDualListBoxModule,
    OffboardingsRoutingModule,
    LayoutContainersModule,
    NgxUiLoaderModule,
  ],
})
export class OffboardingsModule {}
