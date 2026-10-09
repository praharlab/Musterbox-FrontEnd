import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditHolidayPolicyComponent } from './edit-holiday-policy.component';

describe('EditHolidayPolicyComponent', () => {
  let component: EditHolidayPolicyComponent;
  let fixture: ComponentFixture<EditHolidayPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditHolidayPolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHolidayPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
