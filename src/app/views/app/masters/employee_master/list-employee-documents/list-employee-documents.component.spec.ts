import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeDocumentsComponent } from './list-employee-documents.component';

describe('ListEmployeeDocumentsComponent', () => {
  let component: ListEmployeeDocumentsComponent;
  let fixture: ComponentFixture<ListEmployeeDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeDocumentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
