import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddFoodAllowancePolicyComponent } from './add-food-allowance-policy.component';

describe('AddFoodAllowancePolicyComponent', () => {
  let component: AddFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<AddFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
