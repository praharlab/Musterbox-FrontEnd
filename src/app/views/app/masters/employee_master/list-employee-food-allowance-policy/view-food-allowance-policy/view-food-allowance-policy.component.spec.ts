import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewFoodAllowancePolicyComponent } from './view-food-allowance-policy.component';

describe('ViewFoodAllowancePolicyComponent', () => {
  let component: ViewFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<ViewFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
