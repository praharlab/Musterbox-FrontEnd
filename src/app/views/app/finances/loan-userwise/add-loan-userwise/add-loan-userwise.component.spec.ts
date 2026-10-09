import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLoanUserwiseComponent } from './add-loan-userwise.component';

describe('AddLoanUserwiseComponent', () => {
  let component: AddLoanUserwiseComponent;
  let fixture: ComponentFixture<AddLoanUserwiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLoanUserwiseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanUserwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
