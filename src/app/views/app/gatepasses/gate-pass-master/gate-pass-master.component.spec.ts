import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GatePassMasterComponent } from './gate-pass-master.component';

describe('GatePassMasterComponent', () => {
  let component: GatePassMasterComponent;
  let fixture: ComponentFixture<GatePassMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GatePassMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatePassMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
