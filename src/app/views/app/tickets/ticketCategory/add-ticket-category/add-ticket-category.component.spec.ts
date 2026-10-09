import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTicketCategoryComponent } from './add-ticket-category.component';

describe('AddTicketCategoryComponent', () => {
  let component: AddTicketCategoryComponent;
  let fixture: ComponentFixture<AddTicketCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTicketCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
