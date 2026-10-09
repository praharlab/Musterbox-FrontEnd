import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ConstantService } from '../services/constant.service';
import { ChatService } from '../services/chat.service';
import { ChatNotificationCountService } from '../services/chat-notification-count.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
@Component({
    selector: 'app-chat-notification',
    templateUrl: './chat-notification.component.html',
    styleUrls: ['./chat-notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChatNotificationComponent implements OnInit {
  chatCount: any;
  chatCountShow: boolean = false;
  showCard: boolean = false;
  selectedEmoji: string | null = null;
  hide: boolean = false;
  formdata: any;
  showMood: boolean = false;
  permissionMood: any = []

  constructor(
    private route: Router,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private chatService: ChatService,
    private notifications: AppNotificationService,
    private chatNotificationCountService: ChatNotificationCountService,
  ) { }

  ngOnInit(): void {
    this.checkPermission()
  }

  checkPermission() {
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.formdata = res.master;
          const permissionData = res.data;
          if (!this.formdata?.includes('Chat')) {
            this.chatCountShow = false;
          }

          this.permissionMood = permissionData.filter((permissionval) => {
            return (
              permissionval.formName == 'MySentiment' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.chatSubscriptionEvents()
        } else {

        }
      });
  }

  onChatClick() {
    this.router.navigate(['app/tickets/chat']);
  }

  getChatNotificationCount() {
    this.api
      .callApi(
        this.constant.GETUSERLIST,
        { page: '', limit: '', receiverID: localStorage.getItem('id') },
        'POST',
        false,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          let chatData = res.data;
          this.chatCount = chatData.reduce((sum, chat) => sum + chat.messageCount, 0);
        }
      });
  }

  toggleCard() {
    // Once today's mood is in, the launcher's only job is to dismiss the widget.
    if (this.selectedEmoji) {
      this.hide = false;
      return;
    }
    this.showCard = !this.showCard;
  }

  getFeedbackData() {
    let id = +localStorage.getItem('id');
    let date = new Date().toISOString().slice(0, 10);
    if (!id) {
      return;
    }

    let query = `?page=1&pageSize=10&userMasterID=${id}&startDate=${date}&endDate=${date}`;
    this.api
      .callApi(this.constant.SENTIMENTPUNCHINAPI + query, {}, 'GET', false, false, true)
      .subscribe(
        (res: any) => {
          if (res.data.length > 0) {
            this.hide = false;
          } else {
            this.hide = true;
          }
        },
        (err) => {
          this.notifications.create('Opps!', 'Something Went Wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }

  selectEmoji(emoji: string) {
    if (!emoji) {
      return;
    }
    this.selectedEmoji = emoji;

    this.api
      .callApi(this.constant.SENTIMENTPUNCHINAPI, { mood: emoji }, 'POST', false, false, true)
      .subscribe(
        (res: any) => {
          setTimeout(() => {
            this.hide = false;
          }, 1000);
        },
        (err) => {
          this.notifications.create('Opps!!', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );
  }

  chatSubscriptionEvents(){
    this.chatNotificationCountService.isChatBot$.subscribe((ischatBot) => {
      this.showMood = ischatBot;
      this.showCard = false;
      this.selectedEmoji = null;
      this.hide = false;
      if (ischatBot) this.getFeedbackData();
    });
    this.chatNotificationCountService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn && this.formdata.includes('Chat')) {
        this.chatCountShow = true;
        this.chatService.onMessage().subscribe((message: any) => {
          if (message) {
            this.getChatNotificationCount();
          }
        });
        this.chatNotificationCountService.refreshComponent$.subscribe(() => {
          this.getChatNotificationCount();
        });



        this.getChatNotificationCount();
      } else {
        this.chatCountShow = false;
      }
    });
  }
}
