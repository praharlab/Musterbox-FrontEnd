import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WagesSheetRoutingModule } from './wages-sheet-routing.module';
import { WagesSheetComponent } from './wages-sheet.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [WagesSheetComponent],
  imports: [
    CommonModule,
    WagesSheetRoutingModule,
    NgxUiLoaderModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class WagesSheetModule { }
