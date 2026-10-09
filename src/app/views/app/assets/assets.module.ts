import { NgModule } from '@angular/core';

import { AssetsRoutingModule } from './assets.routing';
import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { AssetsComponent } from './assets.component';
import { AssetMasterComponent } from './asset-master/asset-master.component';

@NgModule({
  declarations: [
    AssetsComponent,
    AssetMasterComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    NgxUiLoaderModule,
  ],
})
export class AssetsModule {}
