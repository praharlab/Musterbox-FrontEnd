import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyattendancereportComponent } from './dailyattendancereport.component';

describe('DailyattendancereportComponent', () => {
  let component: DailyattendancereportComponent;
  let fixture: ComponentFixture<DailyattendancereportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DailyattendancereportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyattendancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
