import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListFoodAllowancePolicyComponent } from './list-food-allowance-policy.component';

describe('ListFoodAllowancePolicyComponent', () => {
  let component: ListFoodAllowancePolicyComponent;
  let fixture: ComponentFixture<ListFoodAllowancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFoodAllowancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFoodAllowancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
