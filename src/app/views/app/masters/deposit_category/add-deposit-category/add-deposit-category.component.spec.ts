import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDepositCategoryComponent } from './add-deposit-category.component';

describe('AddDepositCategoryComponent', () => {
  let component: AddDepositCategoryComponent;
  let fixture: ComponentFixture<AddDepositCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddDepositCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepositCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
