import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAttendanceBonusPolicyComponent } from './add-attendance-bonus-policy.component';

describe('AddAttendanceBonusPolicyComponent', () => {
  let component: AddAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<AddAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
