import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTicketSubCategoryComponent } from './edit-ticket-sub-category.component';

describe('EditTicketSubCategoryComponent', () => {
  let component: EditTicketSubCategoryComponent;
  let fixture: ComponentFixture<EditTicketSubCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditTicketSubCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTicketSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
