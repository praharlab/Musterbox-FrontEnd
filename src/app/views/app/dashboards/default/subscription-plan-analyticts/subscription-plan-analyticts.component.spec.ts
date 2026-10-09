import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubscriptionPlanAnalytictsComponent } from './subscription-plan-analyticts.component';

describe('SubscriptionPlanAnalytictsComponent', () => {
  let component: SubscriptionPlanAnalytictsComponent;
  let fixture: ComponentFixture<SubscriptionPlanAnalytictsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionPlanAnalytictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPlanAnalytictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
