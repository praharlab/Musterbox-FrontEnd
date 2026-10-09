import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditGoalSettingComponent } from './edit-goal-setting.component';

describe('EditGoalSettingComponent', () => {
  let component: EditGoalSettingComponent;
  let fixture: ComponentFixture<EditGoalSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGoalSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
