import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatNotificationComponent } from './chat-notification.component';

describe('ChatNotificationComponent', () => {
  let component: ChatNotificationComponent;
  let fixture: ComponentFixture<ChatNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChatNotificationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
