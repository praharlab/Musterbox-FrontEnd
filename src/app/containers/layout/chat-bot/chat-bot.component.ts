import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ChatNotificationCountService } from 'src/app/services/chat-notification-count.service';
import { ChatService } from 'src/app/services/chat.service';

interface Message {
  sender: string;
  content: string;
}

@Component({
    selector: 'app-chat-bot',
    templateUrl: './chat-bot.component.html',
    styleUrls: ['./chat-bot.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChatBotComponent implements OnInit {
  @ViewChild('chatHistory') chatHistory!: ElementRef;

  constructor(
    private chatService: ChatService,
    private chatNotificationCountService: ChatNotificationCountService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  chatBotShow: number = 0;
  userInput: string = '';
  messages: Message[] = [];
  event: string = '';
  childEvent: string | undefined;
  isOpenSwitcher = false;
  toggleClass = 'theme-colors2';

  ngOnInit() {
    this.chatNotificationCountService.isChatBot$.subscribe((isChatBot) => {
      if (isChatBot) {
        this.chatBotShow = 1;
        this.changeDetector.detectChanges();
      } else {
        this.chatBotShow = 0;
        this.changeDetector.detectChanges();
      }
    });
  }

  getChat() {
    this.chatService.sendCustomEvent('chatbot', 'adsdas', 'init');

    this.chatService.getNestedEvent().subscribe((data) => {
      this.appendMessage('bot', data.message);
      this.event = data.event;
      this.childEvent = data.childEvent;
    });
  }

  toggleSwitcher(event): void {
    this.isOpenSwitcher = !this.isOpenSwitcher;
    this.toggleClass = this.isOpenSwitcher ? 'theme-colors2 shown' : 'theme-colors2 hidden';
    if (this.toggleClass === 'theme-colors2 shown') {
      this.chatService.chatBotConnect();
      this.getChat();
    } else {
      this.restart('exit', false);
    }
    event.stopPropagation();
  }

  sendMessage() {
    switch (this.userInput.trim()) {
      case '':
        break;
      case 'exit':
        this.isOpenSwitcher = !this.isOpenSwitcher;
        this.toggleClass = 'theme-colors2 hidden';
        this.restart(this.userInput, false);
        break;
      default:
        this.appendMessage('user', this.userInput);
        this.chatService.sendCustomEvent('chatbot', this.userInput, this.event, this.childEvent);
        this.userInput = '';
        break;
    }
  }

  appendMessage(sender: string, message: string) {
    this.messages.push({ sender, content: message });
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  scrollToBottom() {
    if (this.chatHistory) {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    }
  }

  restart(input: string, status: boolean) {
    this.appendMessage('user', input);
    this.chatService.sendCustomEvent('chatbot', input, this.event, this.childEvent);
    this.userInput = '';
    this.messages = [];

    if (status) {
      setTimeout(() => {
        this.chatService.chatBotConnect();
        this.getChat();
      }, 500);
    }
  }
}
