import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBankBranchComponent } from './edit-bank-branch.component';

describe('EditBankBranchComponent', () => {
  let component: EditBankBranchComponent;
  let fixture: ComponentFixture<EditBankBranchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
