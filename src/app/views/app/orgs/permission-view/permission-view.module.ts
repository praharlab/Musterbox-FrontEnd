import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionViewComponent } from './permission-view.component';


@NgModule({
  declarations: [
    PermissionViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PermissionViewComponent
  ]
})
export class PermissionViewModule { }
