import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPolicyDocumentsComponent } from './add-policy-documents.component';

describe('AddPolicyDocumentsComponent', () => {
  let component: AddPolicyDocumentsComponent;
  let fixture: ComponentFixture<AddPolicyDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPolicyDocumentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPolicyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
