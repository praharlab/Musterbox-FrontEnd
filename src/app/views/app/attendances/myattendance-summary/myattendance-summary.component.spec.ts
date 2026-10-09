import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyattendanceSummaryComponent } from './myattendance-summary.component';

describe('MyattendanceSummaryComponent', () => {
  let component: MyattendanceSummaryComponent;
  let fixture: ComponentFixture<MyattendanceSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyattendanceSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyattendanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
