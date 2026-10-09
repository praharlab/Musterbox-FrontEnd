import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditVisitPurposeComponent } from './edit-visit-purpose.component';

describe('EditVisitPurposeComponent', () => {
  let component: EditVisitPurposeComponent;
  let fixture: ComponentFixture<EditVisitPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditVisitPurposeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
