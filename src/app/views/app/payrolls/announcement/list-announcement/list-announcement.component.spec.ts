import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAnnouncementComponent } from './list-announcement.component';

describe('ListAnnouncementComponent', () => {
  let component: ListAnnouncementComponent;
  let fixture: ComponentFixture<ListAnnouncementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAnnouncementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
