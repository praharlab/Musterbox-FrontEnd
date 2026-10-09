import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDealerPlanComponent } from './list-dealer-plan.component';

describe('ListDealerPlanComponent', () => {
  let component: ListDealerPlanComponent;
  let fixture: ComponentFixture<ListDealerPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDealerPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDealerPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
