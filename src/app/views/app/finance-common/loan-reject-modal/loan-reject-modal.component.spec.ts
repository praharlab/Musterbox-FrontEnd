import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanRejectModalComponent } from './loan-reject-modal.component';

describe('LoanRejectModalComponent', () => {
  let component: LoanRejectModalComponent;
  let fixture: ComponentFixture<LoanRejectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanRejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
