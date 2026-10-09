import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService, ISidebar } from 'src/app/containers/layout/sidebar/sidebar.service';
import { ChunkService } from 'src/app/services/chunk.service';
import { ChatNotificationCountService } from 'src/app/services/chat-notification-count.service';
import { ChatService } from 'src/app/services/chat.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-app',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  sidebar: ISidebar;
  subscription: Subscription;
  formdata: any;
  loginUserId = localStorage.getItem('id');

  constructor(
    private sidebarService: SidebarService,
    private chunkService: ChunkService,
    private chatService: ChatService,
    private chatNotificationCountService: ChatNotificationCountService,
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {
    this.chatService.connect();
    this.chatService.listSignIn(this.loginUserId);

    this.chatNotificationCountService.chatBotShow();

  }

  ngOnInit(): void {
    this.loginUserId = localStorage.getItem('id');
    this.checkPermission();
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      },
    );
  }


  checkPermission() {
    this.spinner.start('oninit');
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;

          if (this.formdata.includes('Chat')) {
            // Connect to Socket.IO
            this.chatNotificationCountService.login();
          }
          this.spinner.stop('oninit');
        } else {
          this.spinner.stop('oninit');
        }
      });
  }

  ngOnDestroy(): void {
    // Disconnect to Socket.IO
    this.chatNotificationCountService.logout();
    this.chatNotificationCountService.chatBotHide();
    this.chatService.listDisconnect();
    this.chatService.disconnect();
    this.subscription.unsubscribe();
    sessionStorage.clear();
  }
}
