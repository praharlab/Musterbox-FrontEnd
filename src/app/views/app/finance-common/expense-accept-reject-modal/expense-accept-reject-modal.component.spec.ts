import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseAcceptRejectModalComponent } from './expense-accept-reject-modal.component';

describe('ExpenseAcceptRejectModalComponent', () => {
  let component: ExpenseAcceptRejectModalComponent;
  let fixture: ComponentFixture<ExpenseAcceptRejectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseAcceptRejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAcceptRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
