import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewHolidayPolicyComponent } from './view-holiday-policy.component';

describe('ViewHolidayPolicyComponent', () => {
  let component: ViewHolidayPolicyComponent;
  let fixture: ComponentFixture<ViewHolidayPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewHolidayPolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHolidayPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
