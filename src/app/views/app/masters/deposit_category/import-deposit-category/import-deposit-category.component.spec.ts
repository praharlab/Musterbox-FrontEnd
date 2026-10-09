import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportDepositCategoryComponent } from './import-deposit-category.component';

describe('ImportDepositCategoryComponent', () => {
  let component: ImportDepositCategoryComponent;
  let fixture: ComponentFixture<ImportDepositCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDepositCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDepositCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
