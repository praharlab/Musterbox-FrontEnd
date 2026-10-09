import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GatepassByUserComponent } from './gatepass-by-user.component';

describe('GatepassByUserComponent', () => {
  let component: GatepassByUserComponent;
  let fixture: ComponentFixture<GatepassByUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GatepassByUserComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
