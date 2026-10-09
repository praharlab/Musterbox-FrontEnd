import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NextvisitscheduleComponent } from './nextvisitschedule.component';

describe('NextvisitscheduleComponent', () => {
  let component: NextvisitscheduleComponent;
  let fixture: ComponentFixture<NextvisitscheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NextvisitscheduleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextvisitscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
