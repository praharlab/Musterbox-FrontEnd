import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDesignationWiseDocumentComponent } from './list-designation-wise-document.component';

describe('ListDesignationWiseDocumentComponent', () => {
  let component: ListDesignationWiseDocumentComponent;
  let fixture: ComponentFixture<ListDesignationWiseDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDesignationWiseDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDesignationWiseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
