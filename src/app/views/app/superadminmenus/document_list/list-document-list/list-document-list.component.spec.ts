import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDocumentListComponent } from './list-document-list.component';

describe('ListDocumentListComponent', () => {
  let component: ListDocumentListComponent;
  let fixture: ComponentFixture<ListDocumentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListDocumentListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
