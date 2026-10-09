import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncomeTaxMasterComponent } from './income-tax-master.component';

describe('IncomeTaxMasterComponent', () => {
  let component: IncomeTaxMasterComponent;
  let fixture: ComponentFixture<IncomeTaxMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeTaxMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTaxMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
