import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDepositComponent } from './list-deposit.component';

describe('ListDepositComponent', () => {
  let component: ListDepositComponent;
  let fixture: ComponentFixture<ListDepositComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListDepositComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
