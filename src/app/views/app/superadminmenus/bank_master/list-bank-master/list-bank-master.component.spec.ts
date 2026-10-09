import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListBankMasterComponent } from './list-bank-master.component';

describe('ListBankMasterComponent', () => {
  let component: ListBankMasterComponent;
  let fixture: ComponentFixture<ListBankMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListBankMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBankMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
