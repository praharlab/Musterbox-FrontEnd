import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLoanMasterComponent } from './edit-loan-master.component';

describe('EditLoanMasterComponent', () => {
  let component: EditLoanMasterComponent;
  let fixture: ComponentFixture<EditLoanMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditLoanMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLoanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
