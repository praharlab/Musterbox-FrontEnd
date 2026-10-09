import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBankMasterComponent } from './edit-bank-master.component';

describe('EditBankMasterComponent', () => {
  let component: EditBankMasterComponent;
  let fixture: ComponentFixture<EditBankMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditBankMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
