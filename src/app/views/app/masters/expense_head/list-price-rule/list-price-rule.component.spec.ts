import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPriceRuleComponent } from './list-price-rule.component';

describe('ListPriceRuleComponent', () => {
  let component: ListPriceRuleComponent;
  let fixture: ComponentFixture<ListPriceRuleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPriceRuleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPriceRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
