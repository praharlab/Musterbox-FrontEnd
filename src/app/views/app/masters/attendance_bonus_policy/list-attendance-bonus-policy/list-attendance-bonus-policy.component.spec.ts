import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAttendanceBonusPolicyComponent } from './list-attendance-bonus-policy.component';

describe('ListAttendanceBonusPolicyComponent', () => {
  let component: ListAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<ListAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
