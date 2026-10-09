import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnfUserDetailsComponent } from './fnf-user-details.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';



@NgModule({
  declarations: [FnfUserDetailsComponent],
  imports: [
    CommonModule,
    LayoutContainersModule
  ],
  exports: [FnfUserDetailsComponent]
})
export class FnfUserDetailsModule { }
