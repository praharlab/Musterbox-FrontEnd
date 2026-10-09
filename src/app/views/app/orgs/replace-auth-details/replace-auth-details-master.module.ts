import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplaceAuthDetailsMasterRoutingModule } from './replace-auth-details-master-routing.module';
import { ReplaceAuthDetailsComponent } from './replace-auth-details.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ReplaceAuthDetailsComponent],
  imports: [
    CommonModule,
    ReplaceAuthDetailsMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ReplaceAuthDetailsMasterModule { }
