import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolkitMasterRoutingModule } from './toolkit-master-routing.module';
import { ToolkitComponent } from './toolkit.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ToolkitComponent],
  imports: [
    CommonModule,
    ToolkitMasterRoutingModule,
    LayoutContainersModule,
    TranslateModule,
  ]
})
export class ToolkitMasterModule { }
