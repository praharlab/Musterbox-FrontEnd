import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddHolidayPolicyComponent } from './add-holiday-policy.component';

describe('AddHolidayPolicyComponent', () => {
  let component: AddHolidayPolicyComponent;
  let fixture: ComponentFixture<AddHolidayPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddHolidayPolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHolidayPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
