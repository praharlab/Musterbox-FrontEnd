import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddJoiningDocumentTypeComponent } from './add-joining-document-type.component';

describe('AddJoiningDocumentTypeComponent', () => {
  let component: AddJoiningDocumentTypeComponent;
  let fixture: ComponentFixture<AddJoiningDocumentTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJoiningDocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJoiningDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
