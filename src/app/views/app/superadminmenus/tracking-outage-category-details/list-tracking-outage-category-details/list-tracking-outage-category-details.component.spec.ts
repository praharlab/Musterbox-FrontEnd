import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTrackingOutageCategoryDetailsComponent } from './list-tracking-outage-category-details.component';

describe('ListTrackingOutageCategoryDetailsComponent', () => {
  let component: ListTrackingOutageCategoryDetailsComponent;
  let fixture: ComponentFixture<ListTrackingOutageCategoryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTrackingOutageCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTrackingOutageCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
