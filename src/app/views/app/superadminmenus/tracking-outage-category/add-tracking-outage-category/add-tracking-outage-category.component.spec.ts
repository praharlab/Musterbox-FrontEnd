import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTrackingOutageCategoryComponent } from './add-tracking-outage-category.component';

describe('AddTrackingOutageCategoryComponent', () => {
  let component: AddTrackingOutageCategoryComponent;
  let fixture: ComponentFixture<AddTrackingOutageCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrackingOutageCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrackingOutageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
