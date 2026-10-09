import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListIncrementLetterComponent } from './list-increment-letter.component';

describe('ListIncrementLetterComponent', () => {
  let component: ListIncrementLetterComponent;
  let fixture: ComponentFixture<ListIncrementLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIncrementLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIncrementLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
