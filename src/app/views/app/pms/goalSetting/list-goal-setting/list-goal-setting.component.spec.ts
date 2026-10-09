import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListGoalSettingComponent } from './list-goal-setting.component';

describe('ListGoalSettingComponent', () => {
  let component: ListGoalSettingComponent;
  let fixture: ComponentFixture<ListGoalSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGoalSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGoalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
