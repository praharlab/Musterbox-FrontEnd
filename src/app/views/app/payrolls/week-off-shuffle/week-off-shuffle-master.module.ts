import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekOffShuffleMasterRoutingModule } from './week-off-shuffle-master-routing.module';
import { ListWeekOffShuffleComponent } from './list-week-off-shuffle/list-week-off-shuffle.component';
import { AddWeekOffShuffleComponent } from './add-week-off-shuffle/add-week-off-shuffle.component';
import { EditWeekOffShuffleComponent } from './edit-week-off-shuffle/edit-week-off-shuffle.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [ListWeekOffShuffleComponent, AddWeekOffShuffleComponent, EditWeekOffShuffleComponent],
  imports: [
    CommonModule,
    WeekOffShuffleMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule
  ]
})
export class WeekOffShuffleMasterModule { }
