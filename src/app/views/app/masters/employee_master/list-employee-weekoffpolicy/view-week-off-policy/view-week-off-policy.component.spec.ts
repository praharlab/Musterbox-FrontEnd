import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewWeekOffPolicyComponent } from './view-week-off-policy.component';

describe('ViewWeekOffPolicyComponent', () => {
  let component: ViewWeekOffPolicyComponent;
  let fixture: ComponentFixture<ViewWeekOffPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewWeekOffPolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWeekOffPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
