import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PayrollGraphComponent } from './payroll-graph.component';

describe('PayrollGraphComponent', () => {
  let component: PayrollGraphComponent;
  let fixture: ComponentFixture<PayrollGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollGraphComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
