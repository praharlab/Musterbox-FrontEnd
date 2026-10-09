import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreboardInfoComponent } from './preboard-info.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleNotificationsModule } from 'angular2-notifications';


@NgModule({
  declarations: [PreboardInfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    ModalModule,
    SimpleNotificationsModule.forRoot(),
    TabsModule
  ],
  exports: [PreboardInfoComponent]
})
export class PreboardInfoModule { }
