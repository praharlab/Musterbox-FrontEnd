import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportMeetingPlaceComponent } from './import-meeting-place.component';

describe('ImportMeetingPlaceComponent', () => {
  let component: ImportMeetingPlaceComponent;
  let fixture: ComponentFixture<ImportMeetingPlaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportMeetingPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMeetingPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
