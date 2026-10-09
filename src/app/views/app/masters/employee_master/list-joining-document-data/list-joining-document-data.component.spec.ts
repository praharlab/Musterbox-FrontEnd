import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListJoiningDocumentDataComponent } from './list-joining-document-data.component';

describe('ListJoiningDocumentDataComponent', () => {
  let component: ListJoiningDocumentDataComponent;
  let fixture: ComponentFixture<ListJoiningDocumentDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListJoiningDocumentDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJoiningDocumentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
