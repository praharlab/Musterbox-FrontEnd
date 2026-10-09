import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTicketCategoryComponent } from './list-ticket-category.component';

describe('ListTicketCategoryComponent', () => {
  let component: ListTicketCategoryComponent;
  let fixture: ComponentFixture<ListTicketCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListTicketCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
