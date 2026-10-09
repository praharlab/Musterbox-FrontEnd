import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamLocationTrackingMasterRoutingModule } from './team-location-tracking-master-routing.module';
import { TeamLocationTrackingComponent } from './team-location-tracking.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { CommonFilterModule } from '../../common-filter/common-filter.module';


@NgModule({
  declarations: [TeamLocationTrackingComponent],
  imports: [
    CommonModule,
    TeamLocationTrackingMasterRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
    LayoutContainersModule,
    TabsModule,
    SimpleNotificationsModule.forRoot(),
    PagesContainersModule,
    CommonFilterModule
  ]
})
export class TeamLocationTrackingMasterModule { }
