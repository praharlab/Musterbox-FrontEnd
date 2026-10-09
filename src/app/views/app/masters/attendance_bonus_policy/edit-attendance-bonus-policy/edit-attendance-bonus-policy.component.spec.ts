import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAttendanceBonusPolicyComponent } from './edit-attendance-bonus-policy.component';

describe('EditAttendanceBonusPolicyComponent', () => {
  let component: EditAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<EditAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
