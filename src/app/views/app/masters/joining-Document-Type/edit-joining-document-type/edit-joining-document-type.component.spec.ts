import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditJoiningDocumentTypeComponent } from './edit-joining-document-type.component';

describe('EditJoiningDocumentTypeComponent', () => {
  let component: EditJoiningDocumentTypeComponent;
  let fixture: ComponentFixture<EditJoiningDocumentTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJoiningDocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJoiningDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
