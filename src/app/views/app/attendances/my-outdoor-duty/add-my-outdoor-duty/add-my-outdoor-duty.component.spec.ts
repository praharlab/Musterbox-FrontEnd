import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMyOutdoorDutyComponent } from './add-my-outdoor-duty.component';

describe('AddMyOutdoorDutyComponent', () => {
  let component: AddMyOutdoorDutyComponent;
  let fixture: ComponentFixture<AddMyOutdoorDutyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMyOutdoorDutyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMyOutdoorDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
