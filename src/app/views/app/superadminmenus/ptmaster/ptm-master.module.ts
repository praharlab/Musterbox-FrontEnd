import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PtmMasterRoutingModule } from './ptm-master-routing.module';
import { ListPtmasterComponent } from './list-ptmaster/list-ptmaster.component';
import { AddPtmasterComponent } from './add-ptmaster/add-ptmaster.component';
import { EdiitPtmasterComponent } from './ediit-ptmaster/ediit-ptmaster.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListPtmasterComponent, AddPtmasterComponent, EdiitPtmasterComponent],
  imports: [
    CommonModule,
    PtmMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgxDatatableModule,
    PaginationModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class PtmMasterModule { }
