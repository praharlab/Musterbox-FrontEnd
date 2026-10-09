import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'src/app/components/perfect-scrollbar/perfect-scrollbar.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { TopnavComponent } from './topnav/topnav.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeadingComponent } from './heading/heading.component';
import { ApplicationMenuComponent } from './application-menu/application-menu.component';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { UserModalComponent } from './user-modal/user-modal.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { UserRequestBoxComponent } from './user-request-box/user-request-box.component'
import { ProfilePicComponent} from './profile-pic/profile-pic.component'
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopUpMenuComponent } from './pop-up-menu/pop-up-menu.component';


@NgModule({
  declarations: [
    TopnavComponent,
    SidebarComponent,
    BreadcrumbComponent,
    FooterComponent,
    HeadingComponent,
    ApplicationMenuComponent,
    UserModalComponent,
    ChatBotComponent,
    SearchBarComponent,
    UserRequestBoxComponent,
    ProfilePicComponent,
    PopUpMenuComponent,
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    TranslateModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    BsDropdownModule,
    TooltipModule,
    NgxUiLoaderModule,
    NgSelectModule,
    SimpleNotificationsModule,
    ModalModule,
  ],
  exports: [
    TopnavComponent,
    SidebarComponent,
    BreadcrumbComponent,
    FooterComponent,
    HeadingComponent,
    ApplicationMenuComponent,
    UserModalComponent,
    ChatBotComponent,
    ProfilePicComponent,
  ],
})
export class LayoutContainersModule { }
