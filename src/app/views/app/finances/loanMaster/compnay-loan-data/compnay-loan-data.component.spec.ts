import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompnayLoanDataComponent } from './compnay-loan-data.component';

describe('CompnayLoanDataComponent', () => {
  let component: CompnayLoanDataComponent;
  let fixture: ComponentFixture<CompnayLoanDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompnayLoanDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompnayLoanDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
