import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncomeTaxDeclarationRequestComponent } from './income-tax-declaration-request.component';

describe('IncomeTaxDeclarationRequestComponent', () => {
  let component: IncomeTaxDeclarationRequestComponent;
  let fixture: ComponentFixture<IncomeTaxDeclarationRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeTaxDeclarationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTaxDeclarationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
