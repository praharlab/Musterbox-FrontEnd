import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDealerPlanComponent } from './add-dealer-plan.component';

describe('AddDealerPlanComponent', () => {
  let component: AddDealerPlanComponent;
  let fixture: ComponentFixture<AddDealerPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDealerPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDealerPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
