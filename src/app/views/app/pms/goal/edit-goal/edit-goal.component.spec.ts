import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditGoalComponent } from './edit-goal.component';

describe('EditGoalComponent', () => {
  let component: EditGoalComponent;
  let fixture: ComponentFixture<EditGoalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
