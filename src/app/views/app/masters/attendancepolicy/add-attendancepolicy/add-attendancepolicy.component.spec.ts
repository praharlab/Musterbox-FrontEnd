import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAttendancepolicyComponent } from './add-attendancepolicy.component';

describe('AddAttendancepolicyComponent', () => {
  let component: AddAttendancepolicyComponent;
  let fixture: ComponentFixture<AddAttendancepolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddAttendancepolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendancepolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
