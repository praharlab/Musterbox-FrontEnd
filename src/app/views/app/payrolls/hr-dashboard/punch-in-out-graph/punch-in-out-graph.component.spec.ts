import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PunchInOutGraphComponent } from './punch-in-out-graph.component';

describe('PunchInOutGraphComponent', () => {
  let component: PunchInOutGraphComponent;
  let fixture: ComponentFixture<PunchInOutGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PunchInOutGraphComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchInOutGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
