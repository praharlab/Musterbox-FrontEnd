import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MoodTrackerMasterComponent } from './mood-tracker-master.component';

describe('MoodTrackerMasterComponent', () => {
  let component: MoodTrackerMasterComponent;
  let fixture: ComponentFixture<MoodTrackerMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MoodTrackerMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodTrackerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
