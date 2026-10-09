import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaySlipGeneratorComponent } from './pay-slip-generator.component';

describe('PaySlipGeneratorComponent', () => {
  let component: PaySlipGeneratorComponent;
  let fixture: ComponentFixture<PaySlipGeneratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaySlipGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaySlipGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
