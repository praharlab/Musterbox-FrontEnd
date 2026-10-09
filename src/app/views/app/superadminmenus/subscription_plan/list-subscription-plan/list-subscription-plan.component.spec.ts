import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSubscriptionPlanComponent } from './list-subscription-plan.component';

describe('ListSubscriptionPlanComponent', () => {
  let component: ListSubscriptionPlanComponent;
  let fixture: ComponentFixture<ListSubscriptionPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListSubscriptionPlanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
