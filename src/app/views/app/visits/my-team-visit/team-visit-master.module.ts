import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamVisitMasterRoutingModule } from './team-visit-master-routing.module';
import { ListMyteamvisitComponent } from './list-myteamvisit/list-myteamvisit.component';
import { AddMyteamvisitComponent } from './add-myteamvisit/add-myteamvisit.component';
import { EditMyteamvisitComponent } from './edit-myteamvisit/edit-myteamvisit.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [ListMyteamvisitComponent, AddMyteamvisitComponent, EditMyteamvisitComponent],
  imports: [
    CommonModule,
    TeamVisitMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    NgxDatatableModule,
    PaginationModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    NgxMaterialTimepickerModule
  ]
})
export class TeamVisitMasterModule { }
