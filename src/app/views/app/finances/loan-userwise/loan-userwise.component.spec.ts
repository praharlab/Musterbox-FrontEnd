import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanUserwiseComponent } from './loan-userwise.component';

describe('LoanUserwiseComponent', () => {
  let component: LoanUserwiseComponent;
  let fixture: ComponentFixture<LoanUserwiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoanUserwiseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanUserwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
