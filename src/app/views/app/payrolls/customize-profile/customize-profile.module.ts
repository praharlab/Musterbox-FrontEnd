import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomizeProfileRoutingModule } from './customize-profile-routing.module';
import { CustomizeProfileComponent } from './customize-profile.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';


@NgModule({
  declarations: [CustomizeProfileComponent],
  imports: [
    CommonModule,
    CustomizeProfileRoutingModule,
    FormsModule,
    NgSelectModule,
    NgxUiLoaderModule,
    PagesContainersModule
  ]
})
export class CustomizeProfileModule { }
