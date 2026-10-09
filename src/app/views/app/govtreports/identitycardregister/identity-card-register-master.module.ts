import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityCardRegisterMasterRoutingModule } from './identity-card-register-master-routing.module';
import { IdentitycardregisterComponent } from './identitycardregister.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [IdentitycardregisterComponent],
  imports: [
    CommonModule,
    IdentityCardRegisterMasterRoutingModule,
    NgxUiLoaderModule,
    LayoutContainersModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    ModalModule
  ]
})
export class IdentityCardRegisterMasterModule { }
