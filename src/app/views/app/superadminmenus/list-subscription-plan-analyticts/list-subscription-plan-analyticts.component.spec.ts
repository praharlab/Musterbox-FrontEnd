import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSubscriptionPlanAnalytictsComponent } from './list-subscription-plan-analyticts.component';

describe('ListSubscriptionPlanAnalytictsComponent', () => {
  let component: ListSubscriptionPlanAnalytictsComponent;
  let fixture: ComponentFixture<ListSubscriptionPlanAnalytictsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubscriptionPlanAnalytictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubscriptionPlanAnalytictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
