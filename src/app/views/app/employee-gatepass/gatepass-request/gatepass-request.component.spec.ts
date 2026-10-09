import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GatepassRequestComponent } from './gatepass-request.component';

describe('GatepassRequestComponent', () => {
  let component: GatepassRequestComponent;
  let fixture: ComponentFixture<GatepassRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GatepassRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
