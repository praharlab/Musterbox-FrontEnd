import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLoanAdvanceComponent } from './add-loan-advance.component';

describe('AddLoanAdvanceComponent', () => {
  let component: AddLoanAdvanceComponent;
  let fixture: ComponentFixture<AddLoanAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLoanAdvanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
