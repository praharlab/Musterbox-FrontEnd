import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCompanyDocumentComponent } from './add-company-document.component';

describe('AddCompanyDocumentComponent', () => {
  let component: AddCompanyDocumentComponent;
  let fixture: ComponentFixture<AddCompanyDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanyDocumentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
