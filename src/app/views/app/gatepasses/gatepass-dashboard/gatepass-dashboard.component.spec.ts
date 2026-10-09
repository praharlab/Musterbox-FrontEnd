import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GatepassDashboardComponent } from './gatepass-dashboard.component';

describe('GatepassDashboardComponent', () => {
  let component: GatepassDashboardComponent;
  let fixture: ComponentFixture<GatepassDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GatepassDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
