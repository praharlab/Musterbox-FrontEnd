import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddVisitPurposeComponent } from './add-visit-purpose.component';

describe('AddVisitPurposeComponent', () => {
  let component: AddVisitPurposeComponent;
  let fixture: ComponentFixture<AddVisitPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddVisitPurposeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
