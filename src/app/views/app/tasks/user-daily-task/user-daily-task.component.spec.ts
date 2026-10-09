import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserDailyTaskComponent } from './user-daily-task.component';

describe('UserDailyTaskComponent', () => {
  let component: UserDailyTaskComponent;
  let fixture: ComponentFixture<UserDailyTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserDailyTaskComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDailyTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
