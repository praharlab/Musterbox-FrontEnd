import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyTaskComponent } from './daily-task.component';

describe('DailyTaskComponent', () => {
  let component: DailyTaskComponent;
  let fixture: ComponentFixture<DailyTaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DailyTaskComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
