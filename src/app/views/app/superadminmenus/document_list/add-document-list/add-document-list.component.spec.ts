import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDocumentListComponent } from './add-document-list.component';

describe('AddDocumentListComponent', () => {
  let component: AddDocumentListComponent;
  let fixture: ComponentFixture<AddDocumentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddDocumentListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
