import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamAdvanceRequestRoutingModule } from './team-advance-request-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { ListTeamAdvanceRequestComponent } from './list-team-advance-request/list-team-advance-request.component';
import { AddTeamAdvanceRequestComponent } from './add-team-advance-request/add-team-advance-request.component';
import { EditTeamAdvanceRequestComponent } from './edit-team-advance-request/edit-team-advance-request.component';

@NgModule({
  declarations: [ListTeamAdvanceRequestComponent, AddTeamAdvanceRequestComponent, EditTeamAdvanceRequestComponent],
  imports: [
    CommonModule,
    TeamAdvanceRequestRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    SimpleNotificationsModule.forRoot(),
    CommonFilterModule,
  ],
})
export class TeamAdvanceRequestModule {}
