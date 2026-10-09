import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTrackingOutageCategoryComponent } from './list-tracking-outage-category.component';

describe('ListTrackingOutageCategoryComponent', () => {
  let component: ListTrackingOutageCategoryComponent;
  let fixture: ComponentFixture<ListTrackingOutageCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTrackingOutageCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTrackingOutageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
