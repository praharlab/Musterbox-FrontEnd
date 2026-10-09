import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form7MasterRoutingModule } from './form7-master-routing.module';
import { Form7Component } from './form7.component';


@NgModule({
  declarations: [Form7Component],
  imports: [
    CommonModule,
    Form7MasterRoutingModule
  ]
})
export class Form7MasterModule { }
