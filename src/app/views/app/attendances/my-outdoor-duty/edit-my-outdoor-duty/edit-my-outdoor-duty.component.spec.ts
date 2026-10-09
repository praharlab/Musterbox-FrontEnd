import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMyOutdoorDutyComponent } from './edit-my-outdoor-duty.component';

describe('EditMyOutdoorDutyComponent', () => {
  let component: EditMyOutdoorDutyComponent;
  let fixture: ComponentFixture<EditMyOutdoorDutyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMyOutdoorDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyOutdoorDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
