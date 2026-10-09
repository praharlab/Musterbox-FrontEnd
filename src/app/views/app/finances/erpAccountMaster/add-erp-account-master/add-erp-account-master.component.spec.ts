import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddErpAccountMasterComponent } from './add-erp-account-master.component';

describe('AddErpAccountMasterComponent', () => {
  let component: AddErpAccountMasterComponent;
  let fixture: ComponentFixture<AddErpAccountMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddErpAccountMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddErpAccountMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
