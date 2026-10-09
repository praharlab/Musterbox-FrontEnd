import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressMasterRoutingModule } from './address-master-routing.module';
import { AddressComponent } from './address/address.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,
    AddressMasterRoutingModule,
    TranslateModule,
    ModalModule,
    FormsModule,
    NgSelectModule,
    TranslateModule
  ]
})
export class AddressMasterModule { }
