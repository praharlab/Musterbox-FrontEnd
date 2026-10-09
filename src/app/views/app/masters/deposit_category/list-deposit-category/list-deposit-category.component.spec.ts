import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDepositCategoryComponent } from './list-deposit-category.component';

describe('ListDepositCategoryComponent', () => {
  let component: ListDepositCategoryComponent;
  let fixture: ComponentFixture<ListDepositCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListDepositCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDepositCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
