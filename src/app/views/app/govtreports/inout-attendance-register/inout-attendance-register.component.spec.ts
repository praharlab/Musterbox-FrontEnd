import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InoutAttendanceRegisterComponent } from './inout-attendance-register.component';

describe('InoutAttendanceRegisterComponent', () => {
  let component: InoutAttendanceRegisterComponent;
  let fixture: ComponentFixture<InoutAttendanceRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InoutAttendanceRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InoutAttendanceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
