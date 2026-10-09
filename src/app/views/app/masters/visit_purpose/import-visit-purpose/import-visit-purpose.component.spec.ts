import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportVisitPurposeComponent } from './import-visit-purpose.component';

describe('ImportVisitPurposeComponent', () => {
  let component: ImportVisitPurposeComponent;
  let fixture: ComponentFixture<ImportVisitPurposeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportVisitPurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportVisitPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
