import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLoanMasterComponent } from './add-loan-master.component';

describe('AddLoanMasterComponent', () => {
  let component: AddLoanMasterComponent;
  let fixture: ComponentFixture<AddLoanMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLoanMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
