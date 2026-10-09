import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAttendancepolicyComponent } from './list-attendancepolicy.component';

describe('ListAttendancepolicyComponent', () => {
  let component: ListAttendancepolicyComponent;
  let fixture: ComponentFixture<ListAttendancepolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAttendancepolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAttendancepolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
