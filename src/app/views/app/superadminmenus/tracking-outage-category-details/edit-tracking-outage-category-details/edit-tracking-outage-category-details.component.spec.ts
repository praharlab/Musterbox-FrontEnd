import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTrackingOutageCategoryDetailsComponent } from './edit-tracking-outage-category-details.component';

describe('EditTrackingOutageCategoryDetailsComponent', () => {
  let component: EditTrackingOutageCategoryDetailsComponent;
  let fixture: ComponentFixture<EditTrackingOutageCategoryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTrackingOutageCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTrackingOutageCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
