import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCompanyDocumentComponent } from './edit-company-document.component';

describe('EditCompanyDocumentComponent', () => {
  let component: EditCompanyDocumentComponent;
  let fixture: ComponentFixture<EditCompanyDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditCompanyDocumentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
