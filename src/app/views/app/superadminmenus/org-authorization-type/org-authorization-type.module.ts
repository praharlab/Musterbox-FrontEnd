import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgAuthorizationTypeRoutingModule } from './org-authorization-type-routing.module';
import { ListOrgAuthTypeComponent } from './list-org-auth-type/list-org-auth-type.component';
import { AddOrgAuthTypeComponent } from './add-org-auth-type/add-org-auth-type.component';
import { EditOrgAuthTypeComponent } from './edit-org-auth-type/edit-org-auth-type.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [ListOrgAuthTypeComponent, AddOrgAuthTypeComponent, EditOrgAuthTypeComponent],
  imports: [
    CommonModule,
    OrgAuthorizationTypeRoutingModule,
    NgxUiLoaderModule,
    NgxDatatableModule,
    PaginationModule,
    FormsModule,
    PagesContainersModule,
    TranslateModule,
  ]
})
export class OrgAuthorizationTypeModule { }
