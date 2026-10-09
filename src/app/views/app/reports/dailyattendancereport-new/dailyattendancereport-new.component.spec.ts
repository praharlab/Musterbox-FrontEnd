import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyattendancereportNewComponent } from './dailyattendancereport-new.component';

describe('DailyattendancereportNewComponent', () => {
  let component: DailyattendancereportNewComponent;
  let fixture: ComponentFixture<DailyattendancereportNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DailyattendancereportNewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyattendancereportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
