import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTicketSubCategoryComponent } from './list-ticket-sub-category.component';

describe('ListTicketSubCategoryComponent', () => {
  let component: ListTicketSubCategoryComponent;
  let fixture: ComponentFixture<ListTicketSubCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListTicketSubCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
