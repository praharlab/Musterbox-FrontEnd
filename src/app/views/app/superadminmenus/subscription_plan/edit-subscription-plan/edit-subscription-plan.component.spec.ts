import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSubscriptionPlanComponent } from './edit-subscription-plan.component';

describe('EditSubscriptionPlanComponent', () => {
  let component: EditSubscriptionPlanComponent;
  let fixture: ComponentFixture<EditSubscriptionPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditSubscriptionPlanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubscriptionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
