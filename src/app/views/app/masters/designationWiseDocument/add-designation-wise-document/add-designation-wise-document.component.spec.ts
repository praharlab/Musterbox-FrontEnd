import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDesignationWiseDocumentComponent } from './add-designation-wise-document.component';

describe('AddDesignationWiseDocumentComponent', () => {
  let component: AddDesignationWiseDocumentComponent;
  let fixture: ComponentFixture<AddDesignationWiseDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDesignationWiseDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDesignationWiseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
