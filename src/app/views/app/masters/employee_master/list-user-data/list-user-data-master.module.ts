import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListUserDataComponent } from './list-user-data.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';


@NgModule({
  declarations: [ListUserDataComponent],
  imports: [
    CommonModule,
    LayoutContainersModule,
    NgxUiLoaderModule
  ],
  exports: [ListUserDataComponent]
})
export class ListUserDataMasterModule { }
