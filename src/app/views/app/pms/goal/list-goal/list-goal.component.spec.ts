import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListGoalComponent } from './list-goal.component';

describe('ListGoalComponent', () => {
  let component: ListGoalComponent;
  let fixture: ComponentFixture<ListGoalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
