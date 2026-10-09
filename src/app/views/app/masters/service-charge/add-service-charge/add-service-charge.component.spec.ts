import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddServiceChargeComponent } from './add-service-charge.component';

describe('AddServiceChargeComponent', () => {
  let component: AddServiceChargeComponent;
  let fixture: ComponentFixture<AddServiceChargeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServiceChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
