import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserTrackingMasterRoutingModule } from './user-tracking-master-routing.module';
import { UserTrackingComponent } from './user-tracking.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { BnNgTreeModule } from 'src/app/components/bn-ng-tree/bn-ng-tree.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AgmDirectionModule } from 'src/app/components/agm/agm.module';
import { AgmCoreModule } from 'src/app/components/agm/agm.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [UserTrackingComponent],
  imports: [
    CommonModule,
    UserTrackingMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    BnNgTreeModule,
    ModalModule,
    TabsModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQyXIWhOoRo6rj0PcaYdEbVTSiu2EHiq4',
    }),
    SimpleNotificationsModule.forRoot(),
    FormsModule
  ]
})
export class UserTrackingMasterModule { }
