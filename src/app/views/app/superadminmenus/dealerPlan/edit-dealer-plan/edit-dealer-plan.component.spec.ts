import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDealerPlanComponent } from './edit-dealer-plan.component';

describe('EditDealerPlanComponent', () => {
  let component: EditDealerPlanComponent;
  let fixture: ComponentFixture<EditDealerPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDealerPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDealerPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
