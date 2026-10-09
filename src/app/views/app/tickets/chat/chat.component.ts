import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { PerfectScrollbarComponent } from 'src/app/components/perfect-scrollbar/perfect-scrollbar.module';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApplicationMenuComponent } from 'src/app/containers/layout/application-menu/application-menu.component';
import { ChatService, IChatContact } from 'src/app/services/chat.service';
import { ChatNotificationCountService } from 'src/app/services/chat-notification-count.service';
import { DatePipe } from '@angular/common';

interface Message {
  senderID: any;
  text: any;
  attachment?: any;
  showOptions: boolean;
  chatId: any;
  createBy: any;
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scroll')
  scrollRef: PerfectScrollbarComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('openModal', { static: false }) openModal: ModalDirective;
  @ViewChild(ApplicationMenuComponent)
  applicationMenuComponent: ApplicationMenuComponent;

  private file: any;
  public conversations: any = [];
  private currentUserId = +localStorage.getItem('id');
  public selectedConversation: any;
  public searchKeyword: any = '';
  public contacts: any = [];
  public message = '';
  public images: any[];
  public imageUrl: string;
  private show: Boolean = false;
  private apiURL = environment.apiUrl;
  private employee: any;
  private user: any;
  private chat: any;
  private permissionview: any;
  private displayName: string = '';
  private designation: any;
  private userIDReceiver: any;
  private contact: IChatContact;
  private count = 0;
  private temp = null;
  public mainLoader: boolean;
  public contactLoader: boolean;
  public conversationsLoader: boolean;
  public psYReachStartLoader: boolean;
  private bb = {
    page: '',
    limit: '',
    searchQuery: '',
    employeeStartDate: '',
    employeeEndDate: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  private openchat: { page: any; limit: any; receiverID: number; senderID: number };
  private paginateData: any = [];
  private Message: {
    id: string;
    body: string;
  };
  private messages: Message[] = [];

  displayUserInformation: boolean = false;
  openChatUserId: any;
  userModalLeftPosition: any;
  userModalTopPosition: any;
  firstName: any;
  lastName: any;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private chatService: ChatService,
    private chatNotificationCountService: ChatNotificationCountService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-footer');
    this.getContacts();
    this.getMsg();
    this.chatNotificationCountService.logout();
    setTimeout(() => {
      this.applicationMenuComponent.toggle();
    }, 500);

    this.chatService.onMessage().subscribe((message: any) => {
      if (this.selectedConversation && this.selectedConversation.id == message.senderId) {
        this.selectedConversation.messages.push({
          senderID: message.senderId,
          text: message.message,
          time: this.currntDateTime().time,
          date: this.currntDateTime().date,
          attachment: message.path,
          chatId: message.messageID,
          createBy: message.createBy,
        });
        this.getMsg();
        setTimeout(() => {
          this.scrollRef.directiveRef.scrollToBottom();
        }, 100);
      } else {
        this.getMsg();
      }
    });

    // Listen for deleteMessage events
    this.chatService.onDeleteMessage().subscribe((message: any) => {
      this.removeMessageFromMessageListUsingChatid(message.messageID);
    });
  }

  private onRightClick(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default context menu from appearing
  }

  private toggleOptions(message: Message): void {
    message.showOptions = !message.showOptions;
    // Close options for other messages
    this.messages.filter((m) => m !== message).forEach((m) => (m.showOptions = false));
  }

  private deleteForMe(message: Message): void {
    this.removeMessageFromMessageListUsingChatid(message.chatId);

    let data = {
      userChatsID: message.chatId,
      updateBy: this.currentUserId,
      status: message.createBy == this.currentUserId ? 2 : 3,
      updateByIp: '',
    };

    this.deleteChat(data);
    message.showOptions = !message.showOptions;
  }

  private deleteForEveryone(message: Message): void {
    this.removeMessageFromMessageListUsingChatid(message.chatId);

    let data = {
      userChatsID: message.chatId,
      updateBy: this.currentUserId,
      status: 0,
      updateByIp: '',
    };

    this.chatService.deleteMessage({
      messageID: message.chatId,
      senderId: this.currentUserId,
      targetId: this.userIDReceiver,
    });

    this.deleteChat(data);
    message.showOptions = !message.showOptions;
  }

  private close(message: Message): void {
    message.showOptions = !message.showOptions;
  }

  private checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;

          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Ticket' && permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  ngOnDestroy(): void {
    // this.chatService.disconnect();
    this.displayUserInformation = true;
    if (localStorage.getItem('token')) {
      this.chatNotificationCountService.login();
    }
    this.renderer.removeClass(document.body, 'no-footer');
  }

  search(event: any): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.bb.searchQuery = '';
      this.getContacts();
    } else {
      this.bb.searchQuery = inputValue;
      this.getContacts();
    }
  }

  private getContacts(): void {
    this.contacts = [];
    this.contactLoader = true;
    this.api
      .callApi(this.constant.GETALLUSERS, this.bb, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          for (var i = 0; i < this.employee.length; i++) {
            let temp = {
              id: this.employee[i].userMasterID,
              title: this.employee[i].displayName,
              firstName: this.employee[i].firstName,
              lastName: this.employee[i].lastName,
              designation: this.employee[i].designation,
              img: this.employee[i].photo
                ? this.apiURL + 'uploads/user/photo/' + this.employee[i].photo
                : null,
              date: '',
            };
            this.contacts.push(temp);
          }
          this.contactLoader = false;
        }
      });
  }
  private getMsg(): void {
    this.conversations = [];
    this.conversationsLoader = true;
    this.api
      .callApi(
        this.constant.GETUSERLIST,
        { page: '', limit: '', receiverID: this.currentUserId },
        'POST',
        false,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.user = res.data;
          for (let i = 0; i < this.user.length; i++) {
            let temp = {
              id: this.user[i].employee.userMasterID,
              title: this.user[i].employee.displayName,
              firstName: this.user[i].employee.firstName,
              lastName: this.user[i].employee.lastName,
              designation: this.user[i].employee.designation,
              img:
                this.user[i].employee.photo != ''
                  ? this.apiURL + 'uploads/user/photo/' + this.user[i].employee.photo
                  : null,
              lastMessageTime: null,
              msg: this.user[i].message,
              attachment: this.user[i].path,
              messageCount: this.user[i].messageCount,
            };
            this.conversations.push(temp);
          }
          this.conversationsLoader = false;
        }
      });
  }

  private openChat(contact: IChatContact) {
    this.displayUserInformation = false;
    this.chatNotificationCountService.chatServiceFunction();
    this.chatService.signIn(this.currentUserId);
    this.getMsg();
    this.message = '';
    this.count = 0;
    let senderID: number = +localStorage.getItem('id');
    let receiverID: number = contact.id;
    this.openChatUserId = contact.id;
    this.displayName = contact.title;
    this.firstName = contact.firstName,
      this.lastName = contact.lastName,
      this.designation = contact.designation;
    this.imageUrl = contact.img;
    this.userIDReceiver = contact.id;
    this.openchat = {
      page: 1,
      limit: 30,
      receiverID: receiverID,
      senderID: senderID,
    };
    this.selectedConversation = {
      id: contact.id,
      users: [
        {
          id: contact.id,
          title: contact.title,
          designation: contact.designation,
          img: contact.img,
          firstName: contact.firstName,
          lastName: contact.lastName,
        },
      ],
      messages: [],
      lastMessageTime: null,
    };

    this.applicationMenuComponent.toggle();

    this.mainLoader = true;
    this.api
      .callApi(this.constant.GETUSERWISECHAT, this.openchat, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let data = res.data;
          data.forEach((chat) => {
            this.selectedConversation.messages.push({
              senderID: chat.senderID,
              text: chat.message,
              time: this.convertDateTime(chat.createdAt).time,
              date: this.convertDateTime(chat.createdAt).date,
              attachment: chat.path,
              chatId: chat.userChatsID,
              createBy: chat.createBy,
            });
          });

          this.selectedConversation.messages.reverse();
          if (this.scrollRef || this.openchat.page == 1) {
            setTimeout(() => {
              this.scrollRef.directiveRef.scrollToBottom();
            }, 100);
          }
          this.mainLoader = false;
        }
      });
  }

  public messageInputKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  public sendMessage(): void {
    if (
      this.selectedConversation &&
      this.selectedConversation.users &&
      this.selectedConversation.users.length > 0
    ) {
      if (this.message.length > 0 || this.images) {
        const formData = new FormData();
        if (this.images) {
          for (let i = 0; i < this.images.length; i++) {
            formData.append('path', this.images[i]);
          }
        }
        formData.append('message', this.message);
        formData.append('receiverID', this.userIDReceiver);
        formData.append('senderID', this.currentUserId.toString());
        formData.append('msgstatus', '1');
        formData.append('createBy', localStorage.getItem('id'));

        this.api
          .callApi(this.constant.POSTSENDMESSAGE, formData, 'POST', false, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.images = [];
              this.message = '';
              this.selectedConversation.messages.push({
                senderID: res.data.senderID,
                text: res.data.message,
                time: this.convertDateTime(res.data.createdAt).time,
                date: this.convertDateTime(res.data.createdAt).date,
                attachment: res.data.path,
                chatId: res.data.userChatsID,
                createBy: res.data.createBy,
              });

              this.chatService.sendMessage({
                message: res.data.message,
                senderId: this.currentUserId,
                targetId: this.userIDReceiver,
                path: res.data.path,
                time: res.data.createdAt,
                createBy: res.data.createBy,
                messageID: res.data.userChatsID,
              });
              this.getMsg();
              setTimeout(() => {
                this.scrollRef.directiveRef.scrollToBottom();
              }, 100);
            } else {
              this.notifications.create('Error', res.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
            }
          });
      }
    } else {
      this.message = '';
      return;
    }
  }

  private getCurrentTime(): string {
    const now = new Date();
    return this.pad(now.getHours(), 2) + ':' + this.pad(now.getMinutes(), 2);
  }

  private pad(number, length): string {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

  private showDocument(item) {
    // let data = item.replace(/\\/g, "/");
    const imgExtensions: string[] = ['.jpeg', '.jpg', '.png', '.gif'];

    const fileExtension = item.toLowerCase().slice(((item.lastIndexOf('.') - 1) >>> 0) + 2);

    if (imgExtensions.includes('.' + fileExtension)) {
      this.imageUrl = this.apiURL + 'uploads/chatfile/' + item;
      this.openModal.show();
    } else {
      window.open(this.apiURL + 'uploads/chatfile/' + item, '_blank');
    }
  }

  private removeAttachment(attachment: any): void {
    // Implement logic to remove the attachment from the `images` array.
    const index = this.images.indexOf(attachment);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
  }

  private onButtonClick() {
    this.show = false;
  }

  public attachFile() {
    this.fileInput.nativeElement.click();
  }

  public onFileChange(event) {
    this.images = [];
    const file = event.target.files && event.target.files[0];

    if (file) {
      const allowedExtensions: string[] = [
        '.pdf',
        '.jpeg',
        '.jpg',
        '.png',
        '.gif',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
      ];
      const fileExtension = file.name
        .toLowerCase()
        .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2);
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

      if (allowedExtensions.includes('.' + fileExtension) && file.size <= maxSizeInBytes) {
        const reader = new FileReader();
        this.images.push(file);
        reader.readAsDataURL(file);
      } else {
        if (!allowedExtensions.includes('.' + fileExtension)) {
          this.notifications.create(
            'Invalid file type.',
            'Please select PNG, JPEG, JPG, PDF, GIF, DOC,DOCX, XLS, XLSX.',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
        } else {
          this.notifications.create(
            'File size exceeds the maximum limit.',
            'Please select a file with a size less than 5 MB.',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
        }
        // Reset file input
        event.target.value = '';
      }
    }
  }

  private onScrollEvent(event: any): void {
    this.count++;
    if (this.count === 1) {
      return;
    } else {
      this.psYReachStartLoader = true;
      setTimeout(() => {
        this.openchat.page = this.count;
        this.api
          .callApi(this.constant.GETUSERWISECHAT, this.openchat, 'POST', false, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              if (res.data.length === 0) {
                return;
              }
              this.paginateData = res.data;
              let tempOld = [];
              tempOld = this.selectedConversation.messages;
              let tempNew = [];
              this.paginateData.forEach((chat) => {
                tempNew.push({
                  senderID: chat.senderID,
                  text: chat.message,
                  time: this.convertDateTime(chat.createdAt).time,
                  date: this.convertDateTime(chat.createdAt).date,
                  attachment: chat.path,
                  chatId: chat.userChatsID,
                  createBy: chat.createBy,
                });
              });
              tempNew.reverse();
              this.selectedConversation.messages = [...tempNew, ...tempOld];
              this.changeDetectorRef.detectChanges();
              this.scrollRef.directiveRef.scrollTo(0, 500);
            }
          });
        this.psYReachStartLoader = false;
      }, 200);
    }
  }

  private deleteChat(response: any) {
    this.api
      .callApi(this.constant.POSTDELETECHAT, response, 'POST', false, false, true)
      .subscribe((res: any) => { });
  }

  private removeMessageFromMessageListUsingChatid(chatId: any) {
    const indexToRemove = this.selectedConversation.messages.findIndex(
      (item) => item.chatId === chatId,
    );

    if (indexToRemove !== -1) {
      this.selectedConversation.messages.splice(indexToRemove, 1);
    }
  }

  private convertDateTime(dateTime: Date) {
    try {
      let utcTimestamp = dateTime;

      // Convert UTC timestamp to a Date object
      let dateObject = new Date(utcTimestamp);

      // Apply Indian time zone offset (UTC+5:30)
      dateObject.setUTCMinutes(dateObject.getUTCMinutes() + 330);

      // Extract date components
      let year = dateObject.getUTCFullYear();
      let month = String(dateObject.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      let day = String(dateObject.getUTCDate()).padStart(2, '0');

      // Extract time components
      let hours = dateObject.getUTCHours();
      let minutes = String(dateObject.getUTCMinutes()).padStart(2, '0');

      // Determine AM/PM
      let period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

      // Create Indian date and time strings with AM/PM
      let indianTime = `${hours}:${minutes} ${period}`;
      let indianDate = `${year}-${month}-${day}`;

      let object = {
        time: indianTime,
        date: indianDate,
      };

      return object;
    } catch (e) {
      let object = {
        time: '',
        date: '',
      };

      return object;
    }
  }

  isNewDate(message: any, index: number): boolean {
    const messageDate = new Date(message.date);

    return (
      index === 0 ||
      messageDate.toDateString() !==
      new Date(this.selectedConversation.messages[index - 1].date).toDateString()
    );
  }

  isNewDateToday(message: any): boolean {
    if (!message.date) {
      return false;
    }
    const messageDate = new Date(message.date);
    const currentDate = new Date();

    return messageDate.toDateString() === currentDate.toDateString();
  }

  private currntDateTime() {
    try {
      // Convert UTC timestamp to a Date object
      let dateObject = new Date();

      // Apply Indian time zone offset (UTC+5:30)
      dateObject.setUTCMinutes(dateObject.getUTCMinutes() + 330);

      // Extract date components
      let year = dateObject.getUTCFullYear();
      let month = String(dateObject.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      let day = String(dateObject.getUTCDate()).padStart(2, '0');

      // Extract time components
      let hours = dateObject.getUTCHours();
      let minutes = String(dateObject.getUTCMinutes()).padStart(2, '0');

      // Determine AM/PM
      let period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

      // Create Indian date and time strings with AM/PM
      let indianTime = `${hours}:${minutes} ${period}`;
      let indianDate = `${year}-${month}-${day}`;

      let object = {
        time: indianTime,
        date: indianDate,
      };

      return object;
    } catch (e) {
      let object = {
        time: '',
        date: '',
      };

      return object;
    }
  }

  @HostListener('window:resize', ['$event'])
  handleClick(event: MouseEvent): void {
    const windowWidth = window.innerWidth;
    if (windowWidth < 425) {
      // Adjust x and y coordinates for smaller window size
      this.userModalLeftPosition = '60px';
      this.userModalTopPosition = '70px';
    } else {
      // Use the original coordinates
      this.userModalLeftPosition = event.clientX + 79 + 'px';
      this.userModalTopPosition = event.clientY - 160 + 'px';
    }
  }

  onInfoClick() {
    this.displayUserInformation = !this.displayUserInformation;
  }

  onChildEvent(data: boolean) {
    this.displayUserInformation = data;
  }
}
