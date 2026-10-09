import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { PerfectScrollbarComponent } from 'src/app/components/perfect-scrollbar/perfect-scrollbar.module';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-ticket-chat',
    templateUrl: './ticket-chat.component.html',
    styleUrls: ['./ticket-chat.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketChatComponent implements OnInit {
  @ViewChild('scroll') scrollRef: PerfectScrollbarComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('openModal', { static: false }) openModal: ModalDirective;
  @ViewChild('openModal2', { static: false }) openModal2: ModalDirective;
  apiURL = environment.apiUrl;
  currentUserId = localStorage.getItem('id');
  searchTerms = new Subject<string>();
  searchKeyword = '';
  message = '';
  selectedConversation: any;
  conversations: any[];
  images: any[];
  imageUrl: string;
  show: Boolean = false;
  imgshow1: boolean;
  responseData: any = [];
  isCollapsedAnimated = false;
  permissionview: any = [];
  file: any;
  file1: string;
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.checkpermission();
    this.getData();
    this.renderer.addClass(document.body, 'no-footer');
    this.getConversations();
    setTimeout(() => {
      this.scrollRef.directiveRef.scrollToBottom();
    }, 500);
  }

  checkpermission() {
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

  getData() {
    this.api
      .callApi(
        this.constant.GETONETICKET + this.formValue.ListTicketComponent.id,
        {},
        'GET',
        false,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          let data = res.data;
          this.responseData = res.data;
          this.selectedConversation = {
            id: data.id,
            users: [
              {
                id: data.ticketAssignedTo.userMasterID,
                title: data.ticketAssignedTo.displayName,
                img:
                  data.ticketAssignedTo.photo != ''
                    ? `${this.apiURL}uploads/user/photo/` +
                    data.ticketAssignedTo.photo
                    : `${this.apiURL}assets/img/profiles/avatar-default.png`,

                question: data.description,
                status: data.status,
                ticketId: data.id,
              },
              {
                id: data.ticketCreatedBy.userMasterID,
                title: data.ticketCreatedBy.displayName,
                img:
                  data.ticketCreatedBy.photo != ''
                    ? `${this.apiURL}uploads/user/photo/` +
                    data.ticketCreatedBy.photo
                    : `${this.apiURL}assets/img/profiles/avatar-default.png`,
              },
            ],
            messages: [], // Initialize an empty array for messages
            lastMessageTime: null, // Initialize lastMessageTime as null
          };

          data.ticketUpdates.forEach((update) => {
            this.selectedConversation.messages.push({
              sender: update.createBy,
              text: update.message,
              attachments: update.attachments,
              time: update.createdAt,
            });

            // Update lastMessageTime with the timestamp of the current message
            this.selectedConversation.lastMessageTime = this.convertUTCtoIST(update.createdAt);
          });
        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('start');
        },
      );
  }

  convertUTCtoIST(utcTimestamp): string {
    const utcDate = new Date(utcTimestamp);
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // IST is UTC +5 hours and 30 minutes

    const istHours = istDate.getUTCHours().toString().padStart(2, '0');
    const istMinutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const istTime = `${istHours}:${istMinutes} ${istHours >= '12' ? 'PM' : 'AM'}`;

    return istTime;
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-footer');
  }

  selectConversation(conversationId: number): void {
    this.selectedConversation = this.conversations.find((x) => x.id === conversationId);
    if (this.scrollRef) {
      setTimeout(() => {
        this.scrollRef.directiveRef.scrollToBottom();
      }, 100);
    }
  }

  attachFile() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event) {
    this.images = [];
    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      const allowedExtensions = ['.png', '.jpeg', '.jpg'];
      const fileExtension = this.file.name
        .toLowerCase()
        .slice(((this.file.name.lastIndexOf('.') - 1) >>> 0) + 2);
      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

      if (allowedExtensions.includes('.' + fileExtension) && this.file.size <= maxSizeInBytes) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          this.images.push(event.target.files[i]);
          reader.readAsDataURL(event.target.files[i]);
        }
      } else {
        if (!allowedExtensions.includes('.' + fileExtension)) {
          this.notifications.create(
            'Invalid file type.',
            'Please select PNG, JPEG, JPG',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.file1 = '';
        } else {
          this.notifications.create(
            'File size exceeds .',
            'the maximum limit of 10 MB.',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.file1 = '';
        }
      }
    }
  }

  getConversations(): void {
    this.changeDetectorRef.detectChanges();
    if (this.scrollRef) {
      this.scrollRef.directiveRef.scrollToBottom();
    }
  }

  messageInputKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (this.message.length > 0 || this.images) {
      const formData = new FormData();
      if (this.images) {
        for (var i = 0; i < this.images.length; i++) {
          formData.append('attachments', this.images[i]);
        }
      }

      if (this.message.length > 0) {
        formData.append('message', this.message);
      } else {
        formData.append('message', '');
      }

      this.api
        .callApi(
          this.constant.UPDATETICKET + this.formValue.ListTicketComponent.id + '/updates',
          formData,
          'POST',
          false,
          false,
          true,
        )
        .subscribe((res: any) => {
          this.ngOnInit();
          this.images = [];
        });
      this.message = '';
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    return this.pad(now.getHours(), 2) + ':' + this.pad(now.getMinutes(), 2);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  pad(number, length): string {
    let str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

  getOtherUser(users: any[]): any {
    return users.find((user) => user.id !== this.currentUserId);
  }

  getUser(senderId: number): any {
    if (senderId === null) {
      senderId = Number(this.responseData.ticketAssignedTo.userMasterID);
    }
    return this.selectedConversation.users.find((user) => user.id === senderId);
  }

  showDocument(item) {
    // let data = item.replace(/\\/g, "/");
    this.imageUrl = this.apiURL + item;
    this.openModal.show();
  }

  showInfo() {
    this.openModal2.show();
  }

  refreshChat(): void {
    this.ngOnInit();
  }

  removeAttachment(attachment: any): void {
    // Implement logic to remove the attachment from the `images` array.
    const index = this.images.indexOf(attachment);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
  }

  onButtonClick() {
    this.show = false;
  }
}
