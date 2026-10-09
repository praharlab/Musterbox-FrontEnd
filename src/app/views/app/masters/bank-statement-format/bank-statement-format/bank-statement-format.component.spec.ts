import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankStatementFormatComponent } from './bank-statement-format.component';

describe('BankStatementFormatComponent', () => {
  let component: BankStatementFormatComponent;
  let fixture: ComponentFixture<BankStatementFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankStatementFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankStatementFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
