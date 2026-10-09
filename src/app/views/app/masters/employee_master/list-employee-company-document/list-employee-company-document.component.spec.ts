import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeCompanyDocumentComponent } from './list-employee-company-document.component';

describe('ListEmployeeCompanyDocumentComponent', () => {
  let component: ListEmployeeCompanyDocumentComponent;
  let fixture: ComponentFixture<ListEmployeeCompanyDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeCompanyDocumentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeCompanyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
