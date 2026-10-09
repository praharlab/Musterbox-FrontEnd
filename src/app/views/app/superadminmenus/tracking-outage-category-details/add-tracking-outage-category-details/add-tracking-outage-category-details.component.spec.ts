import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTrackingOutageCategoryDetailsComponent } from './add-tracking-outage-category-details.component';

describe('AddTrackingOutageCategoryDetailsComponent', () => {
  let component: AddTrackingOutageCategoryDetailsComponent;
  let fixture: ComponentFixture<AddTrackingOutageCategoryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrackingOutageCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrackingOutageCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
