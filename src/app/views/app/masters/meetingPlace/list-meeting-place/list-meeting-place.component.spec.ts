import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMeetingPlaceComponent } from './list-meeting-place.component';

describe('ListMeetingPlaceComponent', () => {
  let component: ListMeetingPlaceComponent;
  let fixture: ComponentFixture<ListMeetingPlaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListMeetingPlaceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMeetingPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
