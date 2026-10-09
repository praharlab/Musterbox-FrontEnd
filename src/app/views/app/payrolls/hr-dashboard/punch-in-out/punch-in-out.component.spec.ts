import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PunchInOutComponent } from './punch-in-out.component';

describe('PunchInOutComponent', () => {
  let component: PunchInOutComponent;
  let fixture: ComponentFixture<PunchInOutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PunchInOutComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
