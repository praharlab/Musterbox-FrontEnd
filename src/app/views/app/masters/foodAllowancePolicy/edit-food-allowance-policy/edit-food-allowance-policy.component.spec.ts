import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditFoodAllowancePolicyComponent } from './edit-food-allowance-policy.component';

describe('EditFoodAllowancePolicyComponent', () => {
  let component: EditFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<EditFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
