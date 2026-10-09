import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeDocumentRejectComponent } from './employee-document-reject.component';

describe('EmployeeDocumentRejectComponent', () => {
  let component: EmployeeDocumentRejectComponent;
  let fixture: ComponentFixture<EmployeeDocumentRejectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDocumentRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDocumentRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
