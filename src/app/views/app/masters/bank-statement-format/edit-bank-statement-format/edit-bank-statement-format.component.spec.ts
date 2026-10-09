import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBankStatementFormatComponent } from './edit-bank-statement-format.component';

describe('EditBankStatementFormatComponent', () => {
  let component: EditBankStatementFormatComponent;
  let fixture: ComponentFixture<EditBankStatementFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankStatementFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankStatementFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
