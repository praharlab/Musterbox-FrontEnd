import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserTrackingComponent } from './user-tracking.component';

describe('UserTrackingComponent', () => {
  let component: UserTrackingComponent;
  let fixture: ComponentFixture<UserTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserTrackingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
