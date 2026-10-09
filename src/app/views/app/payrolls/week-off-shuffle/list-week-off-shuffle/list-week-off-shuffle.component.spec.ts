import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListWeekOffShuffleComponent } from './list-week-off-shuffle.component';

describe('ListWeekOffShuffleComponent', () => {
  let component: ListWeekOffShuffleComponent;
  let fixture: ComponentFixture<ListWeekOffShuffleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWeekOffShuffleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWeekOffShuffleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
