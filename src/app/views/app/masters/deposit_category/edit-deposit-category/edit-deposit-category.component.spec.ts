import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDepositCategoryComponent } from './edit-deposit-category.component';

describe('EditDepositCategoryComponent', () => {
  let component: EditDepositCategoryComponent;
  let fixture: ComponentFixture<EditDepositCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditDepositCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDepositCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
