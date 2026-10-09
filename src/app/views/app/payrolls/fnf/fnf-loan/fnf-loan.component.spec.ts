import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfLoanComponent } from './fnf-loan.component';

describe('FnfLoanComponent', () => {
  let component: FnfLoanComponent;
  let fixture: ComponentFixture<FnfLoanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
