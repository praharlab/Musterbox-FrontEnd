import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListloanAdvanceComponent } from './listloan-advance.component';

describe('ListloanAdvanceComponent', () => {
  let component: ListloanAdvanceComponent;
  let fixture: ComponentFixture<ListloanAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListloanAdvanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListloanAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
