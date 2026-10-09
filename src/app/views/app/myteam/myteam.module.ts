import { NgModule } from '@angular/core';
import { MyTeamRoutingModule } from './myteam.routing';
import { MyteamComponent } from './myteam.component';
import { MyteammasterComponent } from './myteammaster/myteammaster.component';
import { CommonModule, DatePipe } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MyteamComponent, MyteammasterComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    MyTeamRoutingModule,
    SharedModule,
    LayoutContainersModule,
    PagesContainersModule,
    CollapseModule,
    NgxUiLoaderModule,
  ],
})
export class MyteamModule {}
