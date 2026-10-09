import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnfAssetsComponent } from './fnf-assets.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';



@NgModule({
  declarations: [FnfAssetsComponent],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    TranslateModule,
     SimpleNotificationsModule.forRoot(),
     ComponentsStateButtonModule
  ],
  exports: [FnfAssetsComponent]
})
export class FnfAssetsModule { }
