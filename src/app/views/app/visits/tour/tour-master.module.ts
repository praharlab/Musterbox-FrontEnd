import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourMasterRoutingModule } from './tour-master-routing.module';
import { ListTourComponent } from './list-tour/list-tour.component';
import { AddTourComponent } from './add-tour/add-tour.component';
import { EditTourComponent } from './edit-tour/edit-tour.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ListTourComponent, AddTourComponent, EditTourComponent],
  imports: [
    CommonModule,
    TourMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ComponentsStateButtonModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class TourMasterModule { }
