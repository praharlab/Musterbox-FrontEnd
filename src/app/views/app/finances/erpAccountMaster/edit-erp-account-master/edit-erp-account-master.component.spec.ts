import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditErpAccountMasterComponent } from './edit-erp-account-master.component';

describe('EditErpAccountMasterComponent', () => {
  let component: EditErpAccountMasterComponent;
  let fixture: ComponentFixture<EditErpAccountMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditErpAccountMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditErpAccountMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
