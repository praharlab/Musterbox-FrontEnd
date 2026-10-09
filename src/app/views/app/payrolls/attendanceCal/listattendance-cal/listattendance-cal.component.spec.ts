import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListattendanceCalComponent } from './listattendance-cal.component';

describe('ListattendanceCalComponent', () => {
  let component: ListattendanceCalComponent;
  let fixture: ComponentFixture<ListattendanceCalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListattendanceCalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListattendanceCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
