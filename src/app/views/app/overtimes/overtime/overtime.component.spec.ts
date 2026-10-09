import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OvertimeComponent } from './overtime.component';

describe('OvertimeComponent', () => {
  let component: OvertimeComponent;
  let fixture: ComponentFixture<OvertimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
