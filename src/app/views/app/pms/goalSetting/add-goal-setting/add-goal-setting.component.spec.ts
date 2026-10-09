import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddGoalSettingComponent } from './add-goal-setting.component';

describe('AddGoalSettingComponent', () => {
  let component: AddGoalSettingComponent;
  let fixture: ComponentFixture<AddGoalSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoalSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
