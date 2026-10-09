import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportDesignationWiseDocumentComponent } from './import-designation-wise-document.component';

describe('ImportDesignationWiseDocumentComponent', () => {
  let component: ImportDesignationWiseDocumentComponent;
  let fixture: ComponentFixture<ImportDesignationWiseDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDesignationWiseDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDesignationWiseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
