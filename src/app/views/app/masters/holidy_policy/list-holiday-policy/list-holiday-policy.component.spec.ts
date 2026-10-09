import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListHolidayPolicyComponent } from './list-holiday-policy.component';

describe('ListHolidayPolicyComponent', () => {
  let component: ListHolidayPolicyComponent;
  let fixture: ComponentFixture<ListHolidayPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListHolidayPolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHolidayPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
