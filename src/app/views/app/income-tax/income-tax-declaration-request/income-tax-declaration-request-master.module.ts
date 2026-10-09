import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeTaxDeclarationRequestMasterRoutingModule } from './income-tax-declaration-request-master-routing.module';
import { IncomeTaxDeclarationRequestComponent } from './income-tax-declaration-request.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [IncomeTaxDeclarationRequestComponent],
  imports: [
    CommonModule,
    IncomeTaxDeclarationRequestMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    TabsModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class IncomeTaxDeclarationRequestMasterModule { }
