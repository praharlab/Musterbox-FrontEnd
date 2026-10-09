import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationAuthorizationRoutingModule } from './organization-authorization-routing.module';
import { ListOrgAuthorizationComponent } from './list-org-authorization/list-org-authorization.component';
import { AddOrgAuthorizationComponent } from './add-org-authorization/add-org-authorization.component';
import { EditOrgAuthorizationComponent } from './edit-org-authorization/edit-org-authorization.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CommonFilterModule } from '../../common-filter/common-filter.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListOrgAuthorizationComponent, AddOrgAuthorizationComponent, EditOrgAuthorizationComponent],
  imports: [
    CommonModule,
    OrganizationAuthorizationRoutingModule,
    NgxUiLoaderModule,
    CommonFilterModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    PagesContainersModule,
    FormsModule,
    TranslateModule
  ]
})
export class OrganizationAuthorizationModule { }
