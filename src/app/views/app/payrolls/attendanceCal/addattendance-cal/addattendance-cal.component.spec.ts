import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddattendanceCalComponent } from './addattendance-cal.component';

describe('AddattendanceCalComponent', () => {
  let component: AddattendanceCalComponent;
  let fixture: ComponentFixture<AddattendanceCalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddattendanceCalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddattendanceCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
