import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabourBillComponent } from './labour-bill.component';

describe('LabourBillComponent', () => {
  let component: LabourBillComponent;
  let fixture: ComponentFixture<LabourBillComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LabourBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabourBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
