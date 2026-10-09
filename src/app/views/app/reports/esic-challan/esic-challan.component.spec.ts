import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EsicChallanComponent } from './esic-challan.component';

describe('EsicChallanComponent', () => {
  let component: EsicChallanComponent;
  let fixture: ComponentFixture<EsicChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EsicChallanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsicChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
