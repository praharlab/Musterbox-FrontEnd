import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditWeekOffShuffleComponent } from './edit-week-off-shuffle.component';

describe('EditWeekOffShuffleComponent', () => {
  let component: EditWeekOffShuffleComponent;
  let fixture: ComponentFixture<EditWeekOffShuffleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWeekOffShuffleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWeekOffShuffleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
