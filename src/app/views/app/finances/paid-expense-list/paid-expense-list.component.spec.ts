import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidExpenseListComponent } from './paid-expense-list.component';

describe('PaidExpenseListComponent', () => {
  let component: PaidExpenseListComponent;
  let fixture: ComponentFixture<PaidExpenseListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PaidExpenseListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
