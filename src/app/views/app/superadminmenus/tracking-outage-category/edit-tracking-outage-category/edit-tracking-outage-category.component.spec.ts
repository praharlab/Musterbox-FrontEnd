import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTrackingOutageCategoryComponent } from './edit-tracking-outage-category.component';

describe('EditTrackingOutageCategoryComponent', () => {
  let component: EditTrackingOutageCategoryComponent;
  let fixture: ComponentFixture<EditTrackingOutageCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTrackingOutageCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTrackingOutageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
