import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddWeekOffShuffleComponent } from './add-week-off-shuffle.component';

describe('AddWeekOffShuffleComponent', () => {
  let component: AddWeekOffShuffleComponent;
  let fixture: ComponentFixture<AddWeekOffShuffleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWeekOffShuffleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWeekOffShuffleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
