import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PenaltyMasterRoutingModule } from './penalty-master-routing.module';
import { ListPenaltyComponent } from './list-penalty/list-penalty.component';
import { AddPenaltyComponent } from './add-penalty/add-penalty.component';
import { EditPenaltyComponent } from './edit-penalty/edit-penalty.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListPenaltyComponent, AddPenaltyComponent, EditPenaltyComponent],
  imports: [
    CommonModule,
    PenaltyMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class PenaltyMasterModule { }
