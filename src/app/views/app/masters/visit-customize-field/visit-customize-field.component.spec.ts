import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisitCustomizeFieldComponent } from './visit-customize-field.component';

describe('VisitCustomizeFieldComponent', () => {
  let component: VisitCustomizeFieldComponent;
  let fixture: ComponentFixture<VisitCustomizeFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VisitCustomizeFieldComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitCustomizeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
