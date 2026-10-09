import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListForm16Component } from './list-form16.component';

describe('ListForm16Component', () => {
  let component: ListForm16Component;
  let fixture: ComponentFixture<ListForm16Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListForm16Component],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListForm16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
