import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LwfChallanComponent } from './lwf-challan.component';

describe('LwfChallanComponent', () => {
  let component: LwfChallanComponent;
  let fixture: ComponentFixture<LwfChallanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LwfChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LwfChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
