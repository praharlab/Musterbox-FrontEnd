import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FooterComponent implements OnInit {
  messagesArray = [];
  tankhwaPatraNameLabel: string = labelUtils.tankhwaPatraNameLabel;
  copyRightYear: string = labelUtils.copyRightYear;

  constructor() {}

  ngOnInit(): void {
    // this.chatService.onMessage().subscribe((message) => {
    // });
  }

  ngOnDestroy(): void {}

  // Your onmessage function
  onMessageGet(message) {
    // Check if a message with the same "created by" ID already exists
    const existingMessageIndex = this.messagesArray.findIndex(
      (msg) => msg.createBy === message.createBy,
    );

    // If the message exists, update its count and "msg"
    if (existingMessageIndex !== -1) {
      this.messagesArray[existingMessageIndex].Count =
        (this.messagesArray[existingMessageIndex].Count || 0) + 1;
      this.messagesArray[existingMessageIndex].msg = message.msg;
    } else {
      // If the message doesn't exist, add it to the array
      this.messagesArray.push({ ...message, Count: 1 });
    }

    return this.messagesArray;
  }
}
