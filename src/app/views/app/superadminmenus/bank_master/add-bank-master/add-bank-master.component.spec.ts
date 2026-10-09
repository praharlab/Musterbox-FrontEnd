import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBankMasterComponent } from './add-bank-master.component';

describe('AddBankMasterComponent', () => {
  let component: AddBankMasterComponent;
  let fixture: ComponentFixture<AddBankMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddBankMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
