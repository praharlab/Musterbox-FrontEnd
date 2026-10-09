import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddGatepassComponent } from './add-gatepass.component';

describe('AddGatepassComponent', () => {
  let component: AddGatepassComponent;
  let fixture: ComponentFixture<AddGatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddGatepassComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
