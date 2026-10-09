import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateBankStatementFormatComponent } from './create-bank-statement-format.component';

describe('CreateBankStatementFormatComponent', () => {
  let component: CreateBankStatementFormatComponent;
  let fixture: ComponentFixture<CreateBankStatementFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBankStatementFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBankStatementFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
