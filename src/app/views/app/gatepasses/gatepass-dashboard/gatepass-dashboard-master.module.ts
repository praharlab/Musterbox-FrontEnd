import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GatepassDashboardMasterRoutingModule } from './gatepass-dashboard-master-routing.module';
import { GatepassDashboardComponent } from './gatepass-dashboard.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [GatepassDashboardComponent],
  imports: [
    CommonModule,
    GatepassDashboardMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class GatepassDashboardMasterModule { }
