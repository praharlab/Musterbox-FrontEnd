import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanySubscriptionPlanExpirationComponent } from './company-subscription-plan-expiration.component';

describe('CompanySubscriptionPlanExpirationComponent', () => {
  let component: CompanySubscriptionPlanExpirationComponent;
  let fixture: ComponentFixture<CompanySubscriptionPlanExpirationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompanySubscriptionPlanExpirationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySubscriptionPlanExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
