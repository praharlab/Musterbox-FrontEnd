import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfessionalTaxRegisterComponent } from './professional-tax-register.component';

describe('ProfessionalTaxRegisterComponent', () => {
  let component: ProfessionalTaxRegisterComponent;
  let fixture: ComponentFixture<ProfessionalTaxRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalTaxRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalTaxRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
