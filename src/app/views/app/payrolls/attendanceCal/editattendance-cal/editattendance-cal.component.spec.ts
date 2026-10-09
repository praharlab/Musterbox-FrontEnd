import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditattendanceCalComponent } from './editattendance-cal.component';

describe('EditattendanceCalComponent', () => {
  let component: EditattendanceCalComponent;
  let fixture: ComponentFixture<EditattendanceCalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditattendanceCalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditattendanceCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
