import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAttendancepolicyComponent } from './edit-attendancepolicy.component';

describe('EditAttendancepolicyComponent', () => {
  let component: EditAttendancepolicyComponent;
  let fixture: ComponentFixture<EditAttendancepolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditAttendancepolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttendancepolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
