import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPolicyDocumentsComponent } from './edit-policy-documents.component';

describe('EditPolicyDocumentsComponent', () => {
  let component: EditPolicyDocumentsComponent;
  let fixture: ComponentFixture<EditPolicyDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditPolicyDocumentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPolicyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
