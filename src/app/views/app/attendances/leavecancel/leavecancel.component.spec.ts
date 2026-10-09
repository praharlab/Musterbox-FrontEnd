import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeavecancelComponent } from './leavecancel.component';

describe('LeavecancelComponent', () => {
  let component: LeavecancelComponent;
  let fixture: ComponentFixture<LeavecancelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeavecancelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavecancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
