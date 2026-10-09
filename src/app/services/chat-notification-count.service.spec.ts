import { TestBed } from '@angular/core/testing';

import { ChatNotificationCountService } from './chat-notification-count.service';

describe('ChatNotificationCountService', () => {
  let service: ChatNotificationCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatNotificationCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
