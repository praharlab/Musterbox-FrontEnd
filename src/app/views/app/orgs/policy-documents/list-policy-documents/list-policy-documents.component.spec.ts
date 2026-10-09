import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPolicyDocumentsComponent } from './list-policy-documents.component';

describe('ListPolicyDocumentsComponent', () => {
  let component: ListPolicyDocumentsComponent;
  let fixture: ComponentFixture<ListPolicyDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPolicyDocumentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPolicyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
