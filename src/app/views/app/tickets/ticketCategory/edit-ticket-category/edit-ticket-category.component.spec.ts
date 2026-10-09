import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTicketCategoryComponent } from './edit-ticket-category.component';

describe('EditTicketCategoryComponent', () => {
  let component: EditTicketCategoryComponent;
  let fixture: ComponentFixture<EditTicketCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditTicketCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTicketCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
