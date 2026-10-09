import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDocumentListComponent } from './edit-document-list.component';

describe('EditDocumentListComponent', () => {
  let component: EditDocumentListComponent;
  let fixture: ComponentFixture<EditDocumentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditDocumentListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
