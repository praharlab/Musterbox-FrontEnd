import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilePhotoLockUnlockMasterRoutingModule } from './profile-photo-lock-unlock-master-routing.module';
import { ProfilephotolockunlockComponent } from './profilephotolockunlock.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [ProfilephotolockunlockComponent],
  imports: [
    CommonModule,
    ProfilePhotoLockUnlockMasterRoutingModule,
    NgxUiLoaderModule,
    PagesContainersModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class ProfilePhotoLockUnlockMasterModule { }
