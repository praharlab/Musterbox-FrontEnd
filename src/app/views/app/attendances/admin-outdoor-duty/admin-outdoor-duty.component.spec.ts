import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminOutdoorDutyComponent } from './admin-outdoor-duty.component';

describe('AdminOutdoorDutyComponent', () => {
  let component: AdminOutdoorDutyComponent;
  let fixture: ComponentFixture<AdminOutdoorDutyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOutdoorDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOutdoorDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
