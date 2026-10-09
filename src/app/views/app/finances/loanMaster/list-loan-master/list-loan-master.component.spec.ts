import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLoanMasterComponent } from './list-loan-master.component';

describe('ListLoanMasterComponent', () => {
  let component: ListLoanMasterComponent;
  let fixture: ComponentFixture<ListLoanMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListLoanMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLoanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
