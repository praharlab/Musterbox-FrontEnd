import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncomeTaxComputationComponent } from './income-tax-computation.component';

describe('IncomeTaxComputationComponent', () => {
  let component: IncomeTaxComputationComponent;
  let fixture: ComponentFixture<IncomeTaxComputationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeTaxComputationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTaxComputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
