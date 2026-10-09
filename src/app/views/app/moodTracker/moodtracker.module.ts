import { NgModule } from '@angular/core';

import { MoodTrackerRoutingModule } from './moodtracker.routing';
import { MoodTrackerComponent } from './moodtracker.component';

import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MoodTrackerMasterComponent } from './mood-tracker-master/mood-tracker-master.component';

@NgModule({
  declarations: [
    MoodTrackerComponent,
    MoodTrackerMasterComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    MoodTrackerRoutingModule,
    FormsModule,
    SharedModule,
    LayoutContainersModule,
    PagesContainersModule,
    CollapseModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    NgxUiLoaderModule,
  ],
})
export class MoodTrackerModule {}
