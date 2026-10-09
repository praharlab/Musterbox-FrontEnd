import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTicketSubCategoryComponent } from './add-ticket-sub-category.component';

describe('AddTicketSubCategoryComponent', () => {
  let component: AddTicketSubCategoryComponent;
  let fixture: ComponentFixture<AddTicketSubCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTicketSubCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
