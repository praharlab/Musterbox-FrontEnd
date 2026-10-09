import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShortLeaveAppReportComponent } from './short-leave-app-report.component';

describe('ShortLeaveAppReportComponent', () => {
  let component: ShortLeaveAppReportComponent;
  let fixture: ComponentFixture<ShortLeaveAppReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortLeaveAppReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortLeaveAppReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
