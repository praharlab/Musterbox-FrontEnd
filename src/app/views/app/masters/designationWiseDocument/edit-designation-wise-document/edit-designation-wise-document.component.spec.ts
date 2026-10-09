import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDesignationWiseDocumentComponent } from './edit-designation-wise-document.component';

describe('EditDesignationWiseDocumentComponent', () => {
  let component: EditDesignationWiseDocumentComponent;
  let fixture: ComponentFixture<EditDesignationWiseDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDesignationWiseDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDesignationWiseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
