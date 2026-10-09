import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListErpAccountMasterComponent } from './list-erp-account-master.component';

describe('ListErpAccountMasterComponent', () => {
  let component: ListErpAccountMasterComponent;
  let fixture: ComponentFixture<ListErpAccountMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListErpAccountMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListErpAccountMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
